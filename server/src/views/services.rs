extern crate diesel;
extern crate rocket;
use crate::services::establish_connection_pg;
use crate::views::models;
use crate::views::schema;
use diesel::prelude::*;
use rocket::get;
use rocket::serde::json::Json;

#[get("/stops/<stop_type>")]
pub fn list_metro_stops(stop_type: String) -> Json<Vec<models::StopRouteDetails>> {
    let filter = match stop_type.as_str() {
        "metro" => 1,
        "rer" => 2,
        "tram" => 0,
        _ => 0,
    };
    use schema::stop_route_details::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stop_route_details
        .filter(schema::stop_route_details::route_type.eq(filter))
        .load::<models::StopRouteDetails>(connection)
        .expect("Error loading stops");
    Json(results)
}

pub fn refresh_materialized_view() -> Result<usize, diesel::result::Error> {
    let conn = &mut establish_connection_pg();
    diesel::sql_query("REFRESH MATERIALIZED VIEW stop_route_details").execute(conn)
}
