use crate::diesel::*;
use base64::{engine::general_purpose, Engine as _};
use diesel::RunQueryDsl;
use meilisearch_sdk::client::Client;
use serde::{Deserialize, Serialize};
use services::establish_connection_pg;

extern crate base64;
extern crate diesel;
extern crate tokio;
pub mod models;
pub mod schema;
mod services;
pub mod tools;
pub mod views;

#[derive(Serialize, Deserialize, Debug)]
pub struct StopEntry {
    id: String,
    stop_id: String,
    stop_name: String,
    route_ids: String,
    route_short_names: String,
}

pub fn get_stopentries(accessible_only: bool) -> Vec<StopEntry> {
    let conn = &mut establish_connection_pg();
    use schema::stops::dsl::*;

    let wheelchair_boarding_filter = if accessible_only {
        vec![1]
    } else {
        vec![0, 1, 2]
    };

    let result = stops
        .inner_join(
            schema::stop_times::table.inner_join(
                schema::trips::table
                    .inner_join(schema::routes::table.inner_join(schema::agency::table)),
            ),
        )
        .filter(schema::stops::wheelchair_boarding.eq_any(wheelchair_boarding_filter))
        .filter(schema::stops::location_type.eq(0))
        .filter(schema::agency::agency_id.ne("IDFM:93"))
        .filter(schema::routes::route_type.eq_any(vec![0, 1, 2]))
        .select((
            parent_station,
            stop_name,
            diesel::dsl::sql::<diesel::sql_types::Text>(
                "string_agg(DISTINCT routes.route_id, ', ')",
            ),
            diesel::dsl::sql::<diesel::sql_types::Text>(
                "string_agg(DISTINCT routes.short_name, ', ')",
            ),
        ))
        .group_by((parent_station, stop_name))
        .load::<(String, String, String, String)>(conn)
        .expect("Error loading stops");

    let mut output_stops: Vec<StopEntry> = Vec::new();
    for stop in result {
        // id is a base64 encoding of the stop_id
        let mut id = general_purpose::URL_SAFE_NO_PAD.encode(stop.0.as_bytes());
        id += general_purpose::URL_SAFE_NO_PAD
            .encode((stop.1).as_bytes())
            .as_str();
        let stop_result = StopEntry {
            id,
            stop_id: stop.0.clone(),
            stop_name: stop.1.clone(),
            route_ids: stop.2.clone(),
            route_short_names: stop.3.clone(),
        };
        output_stops.push(stop_result);
    }
    println!("{:?}", output_stops.len());
    output_stops
}

#[tokio::main]
async fn main() {
    let client = Client::new(
        "http://localhost:7700",
        Some("disregard-shingle-steadier-nuclear"),
    )
    .unwrap();

    // Delete existing indexes
    let _ = client.delete_index("stops").await;
    let _ = client.delete_index("stops_pmr").await;

    // read from the database to retrieve the stops and routes
    let stops = get_stopentries(false);

    // adding documents
    let res = client
        .index("stops")
        .add_documents(&stops, Some("id"))
        .await
        .unwrap()
        .wait_for_completion(&client, None, None)
        .await
        .unwrap();

    println!("{:?}", res);

    let stops_pmr = get_stopentries(true);

    let res = client
        .index("stops_pmr")
        .add_documents(&stops_pmr, Some("id"))
        .await
        .unwrap()
        .wait_for_completion(&client, None, None)
        .await
        .unwrap();

    println!("{:?}", res);
}
