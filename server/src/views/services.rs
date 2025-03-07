extern crate diesel;
extern crate rocket;
use std::ops::Add;
use std::ops::Sub;

use crate::models::Transfer;
use crate::services::establish_connection_pg;
use crate::services::list_transfers;
use crate::tools::graph::Graph;
use crate::views::models;
use crate::views::schema;
use diesel::alias;
use diesel::prelude::*;
use rocket::get;
use rocket::response::status::NotFound;
use rocket::serde::json::Json;
use rocket::State;
use serde::Deserialize;
use serde::Serialize;
use time::macros::format_description;
use time::Date;
use time::Duration;
use time::PrimitiveDateTime;
use time::Time;

#[get("/stops?<metro>&<rer>&<tram>&<train>")]
pub fn list_stops(
    metro: Option<bool>,
    rer: Option<bool>,
    tram: Option<bool>,
    train: Option<bool>,
) -> Json<Vec<models::StopRouteDetails>> {
    use schema::stop_route_details::dsl::*;
    let mut results = stop_route_details
        .inner_join(crate::schema::agency::table.on(agency_id.eq(crate::schema::agency::agency_id)))
        .into_boxed();
    let connection = &mut establish_connection_pg();
    let mut filters = Vec::<i32>::new();
    if metro.unwrap_or(false) {
        filters.push(1);
    }
    if tram.unwrap_or(false) {
        filters.push(0);
    }
    if train.unwrap_or(false) || rer.unwrap_or(false) {
        filters.push(2);
    }
    if filters.is_empty() {
        // send everything
        return Json(Vec::new());
    }
    if rer.unwrap_or(false) && !train.unwrap_or(false) {
        println!("rer");
        results = results.filter(crate::schema::agency::dsl::agency_id.ne("IDFM:1046"));
    } else if train.unwrap_or(false) && !rer.unwrap_or(false) {
        results = results.filter(crate::schema::agency::dsl::agency_id.eq("IDFM:1046"));
    }
    let results = results
        .filter(route_type.eq_any(&filters))
        .select(stop_route_details::all_columns())
        .load::<models::StopRouteDetails>(connection)
        .expect("Error loading stops");
    Json(results)
}

#[get("/stop/<id>?details")]
pub fn get_stop_details(id: &str) -> Json<Vec<models::StopRouteDetails>> {
    use schema::stop_route_details::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stop_route_details
        .filter(stop_id.eq(id))
        .load::<models::StopRouteDetails>(connection)
        .expect("Error loading stops");
    Json(results)
}

pub fn refresh_materialized_view() -> Result<usize, diesel::result::Error> {
    let conn = &mut establish_connection_pg();
    diesel::sql_query("REFRESH MATERIALIZED VIEW stop_route_details").execute(conn)?;
    diesel::sql_query("REFRESH MATERIALIZED VIEW average_stop_times").execute(conn)?;
    diesel::sql_query("REFRESH MATERIALIZED VIEW stop_times_joined").execute(conn)
}

#[get("/transfers?<metro>&<rer>&<tram>")]
pub fn list_metro_stops_transfers(
    metro: Option<bool>,
    rer: Option<bool>,
    tram: Option<bool>,
) -> Json<Vec<Transfer>> {
    let mut filters = Vec::<i32>::new();
    if metro.unwrap_or(false) {
        filters.push(1);
    }
    if rer.unwrap_or(false) {
        filters.push(2);
    }
    if tram.unwrap_or(false) {
        filters.push(0);
    }
    if filters.is_empty() {
        // send everything
        return list_transfers();
    }
    use crate::schema::transfers::dsl::*;
    let connection = &mut establish_connection_pg();
    let (stop1, stop2) = alias!(
        schema::stop_route_details as stop1,
        schema::stop_route_details as stop2
    );
    let results = transfers
        .inner_join(stop1.on(from_stop_id.eq(stop1.fields(schema::stop_route_details::stop_id))))
        .inner_join(stop2.on(to_stop_id.eq(stop2.fields(schema::stop_route_details::stop_id))))
        .select(transfers::all_columns())
        .filter(
            stop1
                .fields(schema::stop_route_details::route_type)
                .eq_any(&filters)
                .and(
                    stop2
                        .fields(schema::stop_route_details::route_type)
                        .eq_any(&filters),
                ),
        )
        .load::<Transfer>(connection)
        .expect("Error loading stops");
    Json(results)
}

#[get("/average_stop_time/<id>")]
pub fn get_average_stop_times(id: &str) -> Json<Vec<models::AverageStopTime>> {
    use schema::average_stop_times::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = average_stop_times
        .filter(
            stop_id
                .eq(id)
                .or(next_stop_id.eq(id))
                .and(avg_travel_time.gt(0)),
        )
        .load::<models::AverageStopTime>(connection)
        .expect("Error loading stops");
    Json(results)
}

#[get("/average_stop_times?<metro>&<rer>&<tram>")]
pub fn list_average_stop_times(
    metro: Option<bool>,
    rer: Option<bool>,
    tram: Option<bool>,
) -> Json<Vec<models::AverageStopTime>> {
    let mut filters = Vec::<i32>::new();
    if metro.unwrap_or(false) {
        filters.push(1);
    }
    if rer.unwrap_or(false) {
        filters.push(2);
    }
    if tram.unwrap_or(false) {
        filters.push(0);
    }
    use schema::average_stop_times::dsl::*;
    let connection = &mut establish_connection_pg();
    let (stop1, stop2) = alias!(
        schema::stop_route_details as stop1,
        schema::stop_route_details as stop2
    );
    let results = average_stop_times
        .inner_join(stop1.on(stop_id.eq(stop1.fields(schema::stop_route_details::stop_id))))
        .inner_join(stop2.on(next_stop_id.eq(stop2.fields(schema::stop_route_details::stop_id))))
        .select(average_stop_times::all_columns())
        .filter(
            stop1
                .fields(schema::stop_route_details::route_type)
                .eq_any(&filters)
                .and(
                    stop2
                        .fields(schema::stop_route_details::route_type)
                        .eq_any(&filters),
                ),
        )
        .load::<models::AverageStopTime>(connection)
        .expect("Error loading stops");
    Json(results)
}

pub fn get_average_times() -> Vec<models::AverageStopTimeWithWait> {
    use schema::average_stop_times::dsl::*;
    let connection = &mut establish_connection_pg();
    let (stop1, stop2) = alias!(
        crate::views::schema::stop_route_details as stop1,
        crate::views::schema::stop_route_details as stop2
    );
    let results = average_stop_times
        .inner_join(stop1.on(stop_id.eq(stop1.fields(schema::stop_route_details::stop_id))))
        .inner_join(stop2.on(next_stop_id.eq(stop2.fields(schema::stop_route_details::stop_id))))
        .select(average_stop_times::all_columns())
        .filter(
            stop1
                .fields(crate::views::schema::stop_route_details::route_type)
                .eq_any([1, 2, 0])
                .and(
                    stop2
                        .fields(crate::views::schema::stop_route_details::route_type)
                        .eq_any([1, 2, 0]),
                ),
        )
        .load::<models::AverageStopTime>(connection)
        .expect("Error loading stops");

    use schema::stop_times_joined::dsl as stop_times_dsl;
    // use custom query to get the number of stops between two stops
    let counts_by_id = stop_times_dsl::stop_times_joined
        .select((
            stop_times_dsl::stop_id1,
            stop_times_dsl::stop_id2,
            diesel::dsl::sql::<diesel::sql_types::Integer>("count(*)::integer"),
        ))
        .group_by((stop_times_dsl::stop_id1, stop_times_dsl::stop_id2))
        .load::<(String, String, i32)>(connection)
        .expect("Error loading stops");

    use crate::views::schema::trips_between_stops_per_hour::dsl as tbspm_dsl;

    let trips_per_hour_exist = tbspm_dsl::trips_between_stops_per_hour
        .load::<models::TripsBetweenStopsPerHour>(connection)
        .expect("Error loading stops");

    let mut average_times = Vec::<models::AverageStopTimeWithWait>::new();
    for i in results {
        let count = counts_by_id
            .iter()
            .find(|x| x.0 == i.stop_id && x.1 == i.next_stop_id)
            .unwrap()
            .2;
        let trip_per_hour = trips_per_hour_exist
            .iter()
            .filter(|x| {
                x.stop_id1 == i.stop_id && x.stop_id2 == i.next_stop_id && x.trip_exists == 1
            })
            .map(|x| x.hour)
            .collect::<Vec<i32>>();

        // make an array of 30 elements with 1 if there is a trip between the two stops at the hour and 0 otherwise
        let mut trip_per_hour_array = [0; 30];
        for i in trip_per_hour {
            trip_per_hour_array[i as usize] = 1;
        }

        let average_time = models::AverageStopTimeWithWait {
            stop_id: i.stop_id.clone(),
            next_stop_id: i.next_stop_id.clone(),
            route_id: i.route_id.clone(),
            avg_travel_time: i.avg_travel_time,
            avg_wait_time: (20 * 3600 / count) as i32,
            trip_per_hour: Some(trip_per_hour_array),
            pmr_compatible: i.wheelchair_accessible == 1,
        };
        average_times.push(average_time);
    }
    average_times
}

pub fn get_average_transfert_times() -> Vec<models::AverageStopTimeWithWait> {
    use crate::schema::transfers::dsl::*;
    let connection = &mut establish_connection_pg();

    let (stop1, stop2) = alias!(
        crate::views::schema::stop_route_details as stop1,
        crate::views::schema::stop_route_details as stop2
    );

    let results = transfers
        .inner_join(stop1.on(from_stop_id.eq(stop1.fields(schema::stop_route_details::stop_id))))
        .inner_join(stop2.on(to_stop_id.eq(stop2.fields(schema::stop_route_details::stop_id))))
        .select((
            transfers::all_columns(),
            stop1.fields(schema::stop_route_details::wheelchair_boarding),
            stop2.fields(schema::stop_route_details::wheelchair_boarding),
        ))
        .load::<(crate::models::Transfer, i32, i32)>(connection)
        .expect("Error loading stops");

    let mut average_times = Vec::<models::AverageStopTimeWithWait>::new();

    for i in results {
        let average_time = models::AverageStopTimeWithWait {
            stop_id: i.0.from_stop_id.clone(),
            next_stop_id: i.0.to_stop_id.clone(),
            route_id: "".to_string(),
            avg_travel_time: i.0.min_transfer_time,
            avg_wait_time: 0,
            trip_per_hour: None,
            pmr_compatible: i.1 == 1 && i.2 == 1,
        };
        average_times.push(average_time);
    }
    average_times
}

pub fn get_parent_transfers_times() -> Vec<models::AverageStopTimeWithWait> {
    // make a list of all the transfers between parent stations and their children with 0 wait time
    use schema::stop_route_details::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stop_route_details
        .filter(location_type.eq(0))
        .select((parent_station, stop_id, wheelchair_boarding))
        .distinct()
        .load::<(String, String, i32)>(connection)
        .expect("Error loading stops");

    let mut average_times = Vec::<models::AverageStopTimeWithWait>::new();

    for i in results {
        let average_time = models::AverageStopTimeWithWait {
            stop_id: i.1.clone(),
            next_stop_id: i.0.clone(),
            route_id: "".to_string(),
            avg_travel_time: 0,
            avg_wait_time: 0,
            trip_per_hour: None,
            pmr_compatible: i.2 == 1,
        };
        average_times.push(average_time);
        // add the reverse transfer
        let average_time = models::AverageStopTimeWithWait {
            stop_id: i.0.clone(),
            next_stop_id: i.1.clone(),
            route_id: "".to_string(),
            avg_travel_time: 0,
            avg_wait_time: 0,
            trip_per_hour: None,
            pmr_compatible: i.2 == 1,
        };
        average_times.push(average_time);
    }

    average_times
}

pub fn get_child_stops(parent_station_filter: &str) -> Vec<String> {
    use schema::stop_route_details::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stop_route_details
        .filter(parent_station.eq(parent_station_filter))
        .filter(location_type.eq(0))
        .select(stop_id)
        .load::<String>(connection)
        .expect("Error loading stops");
    results
}

pub fn remove_trailing_stops(path: Vec<String>) -> Vec<String> {
    use crate::schema::stops::dsl as stops_dsl;
    let connection = &mut establish_connection_pg();
    let mut path = path;

    if path.len() < 2 {
        return path;
    }

    // remove first node if it is a parent station
    let start = stops_dsl::stops
        .filter(stops_dsl::stop_id.eq(&path[0]))
        .select(stops_dsl::location_type)
        .first::<i32>(&mut establish_connection_pg())
        .expect("Error loading stops");

    if start == 1 {
        path.remove(0);
    }

    // remove last node if it is a parent station
    let end = stops_dsl::stops
        .filter(stops_dsl::stop_id.eq(&path[path.len() - 1]))
        .select(stops_dsl::location_type)
        .first::<i32>(connection)
        .expect("Error loading stops");

    if end == 1 {
        path.pop();
    }

    path
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PathNode {
    from_stop_id: String,
    to_stop_id: String,
    route_id: Option<String>,
    route_short_name: Option<String>,
    wait_time: u32,
    travel_time: u32,
    trip_id: Option<String>,
}

pub struct ErrorNotFound {
    pub forbiden_edge: Option<(String, String)>,
}

pub fn real_time_path(
    path: (u32, Vec<String>),
    start_date: PrimitiveDateTime,
) -> Result<(u32, Vec<PathNode>), ErrorNotFound> {
    // for every pair of stops in the path, we need to check the stop times or the transfers
    let mut new_path: Vec<PathNode> = Vec::new();

    if path.1.len() < 2 {
        return Err(ErrorNotFound {
            forbiden_edge: None,
        });
    }

    let connection = &mut establish_connection_pg();

    let current_time = start_date.clone();
    let time = current_time.time().as_hms();
    let mut time = (time.0 as i32 * 3600) + (time.1 as i32 * 60) + (time.2 as i32);

    let mut current_stop = path.1[0].clone();

    for stop_id in path.1.iter().skip(1) {
        use crate::schema::routes::dsl as routes_dsl;
        use crate::schema::trips::dsl as trips_dsl;
        use schema::stop_times_joined::dsl as stop_times_dsl;

        let stop_time = stop_times_dsl::stop_times_joined
            .inner_join(trips_dsl::trips)
            .inner_join(routes_dsl::routes.on(trips_dsl::route_id.eq(routes_dsl::route_id)))
            .filter(
                stop_times_dsl::stop_id1
                    .eq(&current_stop)
                    .and(stop_times_dsl::stop_id2.eq(stop_id.clone())),
            )
            .filter(stop_times_dsl::departure_time1.ge(time))
            .order(stop_times_dsl::departure_time1.asc())
            .select((
                stop_times_dsl::departure_time1,
                stop_times_dsl::arrival_time2,
                trips_dsl::route_id,
                routes_dsl::short_name,
                stop_times_dsl::trip_id,
            ))
            .first::<(i32, i32, String, String, String)>(connection);

        match stop_time {
            Ok((departure_time, arrival_time, route_id, route_short_name, trip_id)) => {
                let wait_time = departure_time - time;
                let travel_time = arrival_time - departure_time;
                new_path.push(PathNode {
                    from_stop_id: current_stop.clone(),
                    to_stop_id: stop_id.clone(),
                    route_id: Some(route_id),
                    route_short_name: Some(route_short_name),
                    wait_time: wait_time as u32,
                    travel_time: travel_time as u32,
                    trip_id: Some(trip_id),
                });
                time = arrival_time;
            }
            Err(_) => {
                // check for transfers
                use crate::schema::transfers::dsl as transfers_dsl;
                let transfer = transfers_dsl::transfers
                    .filter(transfers_dsl::from_stop_id.eq(&current_stop))
                    .filter(transfers_dsl::to_stop_id.eq(stop_id.clone()))
                    .first::<Transfer>(connection);

                match transfer {
                    Ok(transfer) => {
                        let walk_time = transfer.min_transfer_time;
                        new_path.push(PathNode {
                            from_stop_id: current_stop.clone(),
                            to_stop_id: stop_id.clone(),
                            route_id: None,
                            route_short_name: None,
                            wait_time: 0,
                            travel_time: walk_time as u32,
                            trip_id: None,
                        });
                        time += walk_time;
                    }
                    Err(_) => {
                        return Err(ErrorNotFound {
                            forbiden_edge: Some((current_stop.clone(), stop_id.clone())),
                        });
                    }
                }
            }
        };
        current_stop = stop_id.clone();
    }
    let cost = new_path
        .iter()
        .fold(0, |acc, x| acc + x.wait_time + x.travel_time);
    Ok((cost, new_path))
}

pub fn real_time_path_reverse(
    path: (u32, Vec<String>),
    end_date: PrimitiveDateTime,
) -> Result<(u32, Vec<PathNode>), ErrorNotFound> {
    // for every pair of stops in the path, we need to check the stop times or the transfers
    let mut new_path: Vec<PathNode> = Vec::new();

    if path.1.len() < 2 {
        return Err(ErrorNotFound {
            forbiden_edge: None,
        });
    }

    let connection = &mut establish_connection_pg();

    let current_time = end_date.clone();
    let time = current_time.time().as_hms();
    let mut time = (time.0 as i32 * 3600) + (time.1 as i32 * 60) + (time.2 as i32);
    println!("max time: {:?}", time);

    let mut current_stop = path.1[path.1.len() - 1].clone();

    let mut prev_departure_time: Option<u32> = None;
    let mut counter = 0; // in case of transfers, we need to retrieve the previous node to update the wait time

    for stop_id in path.1.iter().rev().skip(1) {
        use crate::schema::routes::dsl as routes_dsl;
        use crate::schema::trips::dsl as trips_dsl;
        use schema::stop_times_joined::dsl as stop_times_dsl;

        let stop_time = stop_times_dsl::stop_times_joined
            .inner_join(trips_dsl::trips)
            .inner_join(routes_dsl::routes.on(trips_dsl::route_id.eq(routes_dsl::route_id)))
            .filter(
                stop_times_dsl::stop_id1
                    .eq(stop_id.clone())
                    .and(stop_times_dsl::stop_id2.eq(&current_stop)),
            )
            .filter(stop_times_dsl::arrival_time2.le(time + 3600 * 24))
            .select((
                stop_times_dsl::departure_time1,
                stop_times_dsl::arrival_time2,
                trips_dsl::route_id,
                routes_dsl::short_name,
                stop_times_dsl::trip_id,
                // computed column true if le than time
                diesel::dsl::sql::<diesel::sql_types::Bool>(
                    format!("arrival_time2 <= {} as is_before", time).as_str(),
                ),
            ))
            .order((
                diesel::dsl::sql::<diesel::sql_types::Bool>("is_before desc"),
                stop_times_dsl::arrival_time2.desc(),
            ))
            .first::<(i32, i32, String, String, String, bool)>(connection);

        match stop_time {
            Ok((departure_time, arrival_time, route_id, route_short_name, trip_id, _is_before)) => {
                println!(
                    "Found trip: {:?} -> {:?} at time {:?}:{:?}:{:?}({:?}) -> {:?}:{:?}:{:?}({:?})",
                    stop_id,
                    current_stop,
                    departure_time / 3600,
                    (departure_time % 3600) / 60,
                    departure_time % 60,
                    departure_time,
                    arrival_time / 3600,
                    (arrival_time % 3600) / 60,
                    arrival_time % 60,
                    arrival_time
                );
                if prev_departure_time.is_some() {
                    // update the wait time of the previous node
                    let new_wait_time = (prev_departure_time.unwrap() as i32 - arrival_time as i32)
                        .rem_euclid(3600 * 24) as u32;
                    new_path[counter].wait_time = new_wait_time;
                }

                let travel_time = arrival_time - departure_time;
                new_path.insert(
                    0,
                    PathNode {
                        from_stop_id: stop_id.clone(),
                        to_stop_id: current_stop.clone(),
                        route_id: Some(route_id),
                        route_short_name: Some(route_short_name),
                        wait_time: 0,
                        travel_time: travel_time as u32,
                        trip_id: Some(trip_id),
                    },
                );
                time = departure_time;
                prev_departure_time = Some(departure_time as u32);
                counter = 0;
            }
            Err(_) => {
                // check for transfers
                use crate::schema::transfers::dsl as transfers_dsl;
                let transfer = transfers_dsl::transfers
                    .filter(transfers_dsl::from_stop_id.eq(stop_id.clone()))
                    .filter(transfers_dsl::to_stop_id.eq(&current_stop))
                    .first::<Transfer>(connection);

                match transfer {
                    Ok(transfer) => {
                        let walk_time = transfer.min_transfer_time;
                        new_path.insert(
                            0,
                            PathNode {
                                from_stop_id: stop_id.clone(),
                                to_stop_id: current_stop.clone(),
                                route_id: None,
                                route_short_name: None,
                                wait_time: 0,
                                travel_time: walk_time as u32,
                                trip_id: None,
                            },
                        );
                        time -= walk_time;
                        prev_departure_time = if prev_departure_time.is_some() {
                            Some(prev_departure_time.unwrap() - walk_time as u32)
                        } else {
                            None
                        };
                        counter += 1;
                    }
                    Err(_) => {
                        return Err(ErrorNotFound {
                            forbiden_edge: Some((stop_id.clone(), current_stop.clone())),
                        });
                    }
                }
            }
        };
        current_stop = stop_id.clone();
    }

    let og_time = end_date.time().as_hms();
    let og_time = (og_time.0 as i32 * 3600) + (og_time.1 as i32 * 60) + (og_time.2 as i32);
    let cost = (og_time as i32 - time as i32).rem_euclid(3600 * 24) as u32;
    println!("Total time of travel (cost + offset): {:?}", cost);
    Ok((cost, new_path))
}

#[get("/path?<start_stop>&<end_stop>&<date>&<time>&<reverse>&<pmr>&<forbiden_edges>")]
pub fn get_path(
    start_stop: &str,
    end_stop: &str,
    date: &str,
    time: &str,
    reverse: Option<bool>,
    pmr: Option<bool>,
    g: &State<Graph>,
    forbiden_edges: Option<Vec<(String, String)>>,
) -> Result<Json<(PrimitiveDateTime, Vec<PathNode>)>, NotFound<String>> {
    let format_date = format_description!("[year]-[month]-[day]");
    let format_time = format_description!("[hour]:[minute]:[second]");
    let _time = Time::parse(time, &format_time).unwrap();

    let shortest_path = g.shortest_path(
        start_stop.to_string(),
        end_stop.to_string(),
        _time.hour() as usize,
        reverse.unwrap_or(false),
        pmr.unwrap_or(false),
        forbiden_edges.clone().unwrap_or(Vec::new()),
    );

    let shortest_path = match shortest_path {
        Some((cost, path)) => {
            let path: Vec<String> = path.iter().map(|x| x.clone()).collect();
            (cost, path)
        }
        None => {
            println!("No path found");
            return Err(NotFound("No path found".to_string()));
        }
    };
    let shortest_path = (shortest_path.0, remove_trailing_stops(shortest_path.1));

    let path = if reverse == Some(true) {
        real_time_path_reverse(
            shortest_path,
            PrimitiveDateTime::new(Date::parse(&date, &format_date).unwrap(), _time),
        )
    } else {
        real_time_path(
            shortest_path,
            PrimitiveDateTime::new(Date::parse(&date, &format_date).unwrap(), _time),
        )
    };

    match path {
        Ok((cost, path)) => {
            let mut endtime =
                PrimitiveDateTime::new(Date::parse(date, &format_date).unwrap(), _time);
            if reverse == Some(true) {
                endtime = endtime.sub(Duration::seconds(cost as i64));
            } else {
                endtime = endtime.add(Duration::seconds(cost as i64));
            }
            Ok(Json((endtime, path)))
        }
        Err(error) => {
            // recursive call to find a path without the forbiden edges
            if let Some(forbiden_edge) = error.forbiden_edge {
                let mut forbiden_edges = forbiden_edges.unwrap_or(Vec::new());
                forbiden_edges.push(forbiden_edge);
                // check that the list is not too long to avoid infinite loops
                if forbiden_edges.len() > 10 {
                    return Err(NotFound("No path found".to_string()));
                }
                return get_path(
                    start_stop,
                    end_stop,
                    date,
                    time,
                    reverse,
                    pmr,
                    g,
                    Some(forbiden_edges),
                );
            } else {
                return Err(NotFound("No path found".to_string()));
            }
        }
    }
}
