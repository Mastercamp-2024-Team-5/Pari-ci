extern crate diesel;
extern crate rocket;
use std::ops::Add;

use crate::models::Transfer;
use crate::services::establish_connection_pg;
use crate::services::list_transfers;
use crate::tools::graph;
use crate::tools::graph::Graph;
use crate::views::models;
use crate::views::schema;
use diesel::alias;
use diesel::prelude::*;
use rocket::get;
use rocket::serde::json::Json;
use rocket::State;
use serde::Deserialize;
use serde::Serialize;
use time::macros::format_description;
use time::Date;
use time::Duration;
use time::PrimitiveDateTime;
use time::Time;

use super::models::StopRouteDetails;

#[get("/stops?<metro>&<rer>&<tram>")]
pub fn list_stops(
    metro: Option<bool>,
    rer: Option<bool>,
    tram: Option<bool>,
) -> Json<Vec<models::StopRouteDetails>> {
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
        return Json(Vec::new());
    }
    use schema::stop_route_details::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stop_route_details
        .filter(route_type.eq_any(&filters))
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
    diesel::sql_query("REFRESH MATERIALIZED VIEW average_stop_times").execute(conn)
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

pub fn get_average_times() -> Vec<models::AverageStopTime> {
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

    results
}

pub fn get_average_transfert_times() -> Vec<models::AverageStopTime> {
    use crate::schema::transfers::dsl::*;
    let connection = &mut establish_connection_pg();

    let (stop1, stop2) = alias!(
        crate::views::schema::stop_route_details as stop1,
        crate::views::schema::stop_route_details as stop2
    );

    let results = transfers
        .inner_join(stop1.on(from_stop_id.eq(stop1.fields(schema::stop_route_details::stop_id))))
        .inner_join(stop2.on(to_stop_id.eq(stop2.fields(schema::stop_route_details::stop_id))))
        .select(transfers::all_columns())
        .load::<crate::models::Transfer>(connection)
        .expect("Error loading stops");

    let mut average_times = Vec::<models::AverageStopTime>::new();

    for i in results {
        let average_time = models::AverageStopTime {
            stop_id: i.from_stop_id.clone(),
            next_stop_id: i.to_stop_id.clone(),
            avg_travel_time: i.min_transfer_time,
        };
        average_times.push(average_time);
    }
    average_times
}

pub fn get_first_child_stop(parent_station_filter: &str) -> String {
    use schema::stop_route_details::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stop_route_details
        .filter(parent_station.eq(parent_station_filter))
        .filter(location_type.eq(0))
        .select(stop_id)
        .limit(1)
        .load::<String>(connection)
        .expect("Error loading stops");
    results.first().unwrap().to_string()
}

pub fn remove_trailing_stops(path: Vec<String>) -> Vec<String> {
    if path.len() < 2 {
        return path;
    }
    // remove stops with same parent_station at start and end
    let mut path = path;
    let connection = &mut establish_connection_pg();
    use schema::stop_route_details::dsl::*;
    let start = stop_route_details
        .filter(stop_id.eq(&path[0]))
        .select(parent_station)
        .first::<String>(connection)
        .expect("Error loading stops");

    // remove stops with same parent_station at start
    while path.len() > 1 {
        let current = stop_route_details
            .filter(stop_id.eq(&path[1]))
            .select(parent_station)
            .first::<String>(connection)
            .expect("Error loading stops");
        if current == start {
            path.remove(0);
        } else {
            break;
        }
    }

    // remove stops with same parent_station at end
    let mut end = stop_route_details
        .filter(stop_id.eq(&path[path.len() - 1]))
        .select(parent_station)
        .first::<String>(connection)
        .expect("Error loading stops");

    while path.len() > 1 {
        let current = stop_route_details
            .filter(stop_id.eq(&path[path.len() - 2]))
            .select(parent_station)
            .first::<String>(connection)
            .expect("Error loading stops");
        if current == end {
            path.pop();
            end = current;
        } else {
            break;
        }
    }

    path
}

#[get("/route/<route_id>/stops")]
pub fn list_sorted_stops(route_id: &str) -> Json<Vec<Vec<String>>> {
    use schema::average_stop_times::dsl as avg_st;
    let connection = &mut establish_connection_pg();
    let results = avg_st::average_stop_times
        .inner_join(
            schema::stop_route_details::table
                .on(avg_st::stop_id.eq(schema::stop_route_details::stop_id)),
        )
        .filter(schema::stop_route_details::route_id.eq(route_id))
        .select(avg_st::average_stop_times::all_columns())
        .load::<models::AverageStopTime>(connection)
        .expect("Error loading stops");
    let mygraph = graph::Graph::generate_graph(results);
    let graphs = mygraph.get_subgraphs();

    Json(
        graphs
            .into_iter()
            .map(|x| x.to_vec())
            .collect::<Vec<Vec<String>>>(),
    )
}

#[get("/route/<route_id>/stops?details")]
pub fn list_sorted_stops_detailed(route_id: &str) -> Json<Vec<Vec<StopRouteDetails>>> {
    use schema::average_stop_times::dsl as avg_st;
    let connection = &mut establish_connection_pg();
    let results = avg_st::average_stop_times
        .inner_join(
            schema::stop_route_details::table
                .on(avg_st::stop_id.eq(schema::stop_route_details::stop_id)),
        )
        .filter(schema::stop_route_details::route_id.eq(route_id))
        .select(avg_st::average_stop_times::all_columns())
        .load::<models::AverageStopTime>(connection)
        .expect("Error loading stops");
    let mygraph = graph::Graph::generate_graph(results);
    let graphs = mygraph.get_subgraphs();

    let mut stop_route_details = Vec::<Vec<StopRouteDetails>>::new();
    let vec = graphs
        .into_iter()
        .map(|x| x.to_vec())
        .collect::<Vec<Vec<String>>>();
    for path in vec {
        let mut details = Vec::<StopRouteDetails>::new();
        for stop in path {
            let stop_details = schema::stop_route_details::table
                .filter(schema::stop_route_details::stop_id.eq(&stop))
                .first::<StopRouteDetails>(connection)
                .expect("Error loading stops");
            details.push(stop_details);
        }
        stop_route_details.push(details);
    }
    Json(stop_route_details)
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PathNode {
    from_stop_id: String,
    to_stop_id: String,
    route_id: Option<String>,
    route_short_name: Option<String>,
    wait_time: u32,
    travel_time: u32,
}

pub fn real_time_path(
    path: (u32, Vec<String>),
    start_date: PrimitiveDateTime,
) -> Result<(u32, Vec<PathNode>), diesel::result::Error> {
    // for every pair of stops in the path, we need to check the stop times or the transfers
    let mut new_path: Vec<PathNode> = Vec::new();

    let connection = &mut establish_connection_pg();

    let current_time = start_date.clone();
    let time = current_time.time().as_hms();
    let mut time = (time.0 as i32 * 3600) + (time.1 as i32 * 60) + (time.0 as i32);

    let mut current_stop = path.1[0].clone();

    for stop_id in path.1.iter().skip(1) {
        use crate::schema::routes::dsl as routes_dsl;
        use crate::schema::stop_times::dsl as stop_times_dsl;
        use crate::schema::trips::dsl as trips_dsl;

        let (stop_t1, stop_t2) = alias!(
            crate::schema::stop_times as stop_t1,
            crate::schema::stop_times as stop_t2
        );

        let stop_time = stop_t1
            .inner_join(
                stop_t2.on(stop_t1
                    .fields(stop_times_dsl::trip_id)
                    .eq(stop_t2.fields(stop_times_dsl::trip_id))),
            )
            .inner_join(
                trips_dsl::trips.on(stop_t1
                    .fields(stop_times_dsl::trip_id)
                    .eq(trips_dsl::trip_id)),
            )
            .inner_join(routes_dsl::routes.on(trips_dsl::route_id.eq(routes_dsl::route_id)))
            .filter(stop_t1.fields(stop_times_dsl::stop_id).eq(&current_stop))
            .filter(stop_t1.fields(stop_times_dsl::departure_time).ge(time))
            .filter(stop_t2.fields(stop_times_dsl::stop_id).eq(stop_id.clone()))
            .filter(stop_t2.fields(stop_times_dsl::arrival_time).ge(time))
            .order(stop_t1.fields(stop_times_dsl::departure_time).asc())
            .select((
                stop_t1.fields(stop_times_dsl::departure_time),
                stop_t2.fields(stop_times_dsl::arrival_time),
                routes_dsl::route_id,
                routes_dsl::short_name,
            ))
            .first::<(i32, i32, String, String)>(connection);

        match stop_time {
            Ok((departure_time, arrival_time, route_id, route_short_name)) => {
                let wait_time = departure_time - time;
                let travel_time = arrival_time - departure_time;
                new_path.push(PathNode {
                    from_stop_id: current_stop.clone(),
                    to_stop_id: stop_id.clone(),
                    route_id: Some(route_id),
                    route_short_name: Some(route_short_name),
                    wait_time: wait_time as u32,
                    travel_time: travel_time as u32,
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
                        });
                        time += walk_time;
                    }
                    Err(_) => {
                        println!(
                            "No transfer or trip found for {:?} -> {:?}",
                            current_stop, stop_id
                        );
                        return Err(diesel::result::Error::NotFound);
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

#[get("/path?<start_stop>&<end_stop>&<date>&<time>")]
pub fn get_path(
    start_stop: &str,
    end_stop: &str,
    date: &str,
    time: &str,
    g: &State<Graph>,
) -> Json<(PrimitiveDateTime, Vec<PathNode>)> {
    let format_date = format_description!("[year]-[month]-[day]");
    let format_time = format_description!("[hour]:[minute]:[second]");

    let start = get_first_child_stop(&start_stop);
    let end = get_first_child_stop(&end_stop);
    let shortest_path = g.shortest_path(start, end);

    let shortest_path = match shortest_path {
        Some((cost, path)) => {
            let path: Vec<String> = path.iter().map(|x| x.clone()).collect();
            (cost, path)
        }
        None => (0, vec![]),
    };
    let shortest_path = (shortest_path.0, remove_trailing_stops(shortest_path.1));

    let path = real_time_path(
        shortest_path,
        PrimitiveDateTime::new(
            Date::parse(&date, &format_date).unwrap(),
            Time::parse(&time, &format_time).unwrap(),
        ),
    )
    .unwrap();

    let mut endtime = PrimitiveDateTime::new(
        Date::parse(date, &format_date).unwrap(),
        Time::parse(time, &format_time).unwrap(),
    );
    endtime = endtime.add(Duration::seconds(path.0 as i64));

    Json((endtime, path.1))
}

#[get("/fast_path?<start_stop>&<end_stop>&<time>")]
pub fn get_fast_path(
    start_stop: &str,
    end_stop: &str,
    time: &str,
    g: &State<Graph>,
) -> Json<(Time, Vec<String>)> {
    let start = get_first_child_stop(start_stop);
    let end = get_first_child_stop(end_stop);
    let shortest_path = g.shortest_path(start, end);
    let mut shortest_path = match shortest_path {
        Some((cost, path)) => {
            let path: Vec<String> = path.iter().map(|x| x.clone()).collect();
            (cost, path)
        }
        None => (0, vec![]),
    };
    shortest_path = (shortest_path.0, remove_trailing_stops(shortest_path.1));
    let format = format_description!("[hour]:[minute]:[second]");
    let mut endtime = Time::parse(time, &format).unwrap();
    endtime = endtime.add(Duration::seconds(shortest_path.0 as i64));
    Json((endtime, shortest_path.1))
}
