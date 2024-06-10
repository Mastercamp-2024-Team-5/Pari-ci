extern crate diesel;
extern crate rocket;
use crate::models;
use crate::schema;
use crate::services::establish_connection_pg;
use diesel::prelude::*;
use rocket::get;
use rocket::serde::json::Json;
use rocket::serde::Deserialize;
use rocket::serde::Serialize;

#[derive(Serialize, Deserialize, Debug)]
pub struct StopDetails {
    stop_id: String,
    stop_name: String,
    stop_lat: f64,
    stop_lon: f64,
    location_type: i32,
    parent_station: String,
    wheelchair_boarding: i32,
    route_id: String,
    route_short_name: String,
    route_long_name: String,
    route_type: i32,
}

#[get("/stops/<stop_type>")]
pub fn list_metro_stops(stop_type: String) -> Json<Vec<StopDetails>> {
    let filter = match stop_type.as_str() {
        "metro" => 1,
        "rer" => 2,
        "tram" => 0,
        _ => 0,
    };
    use schema::stops::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stops
        .inner_join(
            schema::stop_times::table
                .inner_join(schema::trips::table.inner_join(schema::routes::table)),
        )
        .filter(schema::routes::dsl::route_type.eq(filter))
        .select((
            schema::stops::table::all_columns(),
            schema::routes::table::all_columns(),
        ))
        .distinct_on(schema::stops::dsl::stop_id)
        .load::<(models::Stop, models::Route)>(connection)
        .expect("Error loading stops");
    let results: Vec<StopDetails> = results
        .iter()
        .map(|(stop, route)| StopDetails {
            stop_id: stop.stop_id.clone(),
            stop_name: stop.stop_name.clone(),
            stop_lat: stop.stop_lat,
            stop_lon: stop.stop_lon,
            location_type: stop.location_type,
            parent_station: stop.parent_station.clone(),
            wheelchair_boarding: stop.wheelchair_boarding,
            route_id: route.route_id.clone(),
            route_short_name: route.short_name.clone(),
            route_long_name: route.long_name.clone(),
            route_type: route.route_type,
        })
        .collect();
    Json(results)
}
