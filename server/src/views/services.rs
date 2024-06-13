extern crate diesel;
extern crate rocket;
use crate::models::Transfer;
use crate::services::establish_connection_pg;
use crate::services::list_transfers;
use crate::tools::graph;
use crate::views::models;
use crate::views::schema;
use diesel::alias;
use diesel::prelude::*;
use rocket::get;
use rocket::serde::json::Json;

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

#[get("/route/stops/<route_id>")]
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
