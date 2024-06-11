extern crate diesel;
extern crate rocket;
use crate::models::Transfer;
use crate::services::establish_connection_pg;
use crate::views::models;
use crate::views::schema;
use diesel::alias;
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

#[get("/transfers/stops/<stop_type>")]
pub fn list_metro_stops_transfers(stop_type: String) -> Json<Vec<Transfer>> {
    let filter = match stop_type.as_str() {
        "metro" => 1,
        "rer" => 2,
        "tram" => 0,
        _ => 0,
    };
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
                .eq(filter)
                .and(
                    stop2
                        .fields(schema::stop_route_details::route_type)
                        .eq(filter),
                ),
        )
        .load::<Transfer>(connection)
        .expect("Error loading stops");
    Json(results)
}
