use crate::diesel::*;
use base64::{engine::general_purpose, Engine as _};
use diesel::RunQueryDsl;
use meilisearch_sdk::client::Client;
use schema::{routes::short_name, trips::route_id};
use serde::{Deserialize, Serialize};
use services::establish_connection_pg;

extern crate base64;
extern crate diesel;
extern crate tokio;
pub mod models;
pub mod schema;
mod services;

#[derive(Serialize, Deserialize, Debug)]
pub struct StopEntry {
    id: String,
    stop_id: String,
    stop_name: String,
    route_id: String,
    route_short_name: String,
}

pub fn get_stopentries() -> Vec<StopEntry> {
    let conn = &mut establish_connection_pg();
    use schema::stops::dsl::*;

    let result = stops
        .inner_join(
            schema::stop_times::table.inner_join(
                schema::trips::table
                    .inner_join(schema::routes::table.inner_join(schema::agency::table)),
            ),
        )
        .filter(schema::stops::location_type.eq(0))
        .filter(
            schema::agency::name
                .eq("RATP")
                .or(schema::agency::name.eq("SNCF")),
        )
        .filter(
            schema::routes::route_type
                .eq(1)
                .or(schema::routes::route_type.eq(2)),
        )
        .select((stop_id, stop_name, route_id, short_name))
        .distinct_on(stop_id)
        .load::<(String, String, String, String)>(conn)
        .expect("Error loading stops");

    let mut output_stops: Vec<StopEntry> = Vec::new();
    for stop in result {
        // id is a base64 encoding of the stop_id
        let id = general_purpose::URL_SAFE_NO_PAD.encode(stop.0.as_bytes());
        let stop_result = StopEntry {
            id,
            stop_id: stop.0.clone(),
            stop_name: stop.1.clone(),
            route_id: stop.2.clone(),
            route_short_name: stop.3.clone(),
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

    // read from the database to retrieve the stops and routes
    let stops = get_stopentries();

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

    // make a search query
    let query = "Montparnasse";
    let res: meilisearch_sdk::search::SearchResults<StopEntry> = client
        .index("stops")
        .search()
        .with_query(query)
        .with_limit(10)
        .execute()
        .await
        .unwrap();

    println!("{:?}", res);
}
