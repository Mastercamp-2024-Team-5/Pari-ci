use crate::diesel::*;
use base64::{engine::general_purpose, Engine as _};
use meilisearch_sdk::client::Client;
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
        .filter(schema::stops::location_type.eq(0))
        .load::<models::Stop>(conn)
        .expect("Error loading stops");

    let mut output_stops: Vec<StopEntry> = Vec::new();
    for stop in result {
        // id is a base64 encoding of the stop_id
        let id = general_purpose::URL_SAFE_NO_PAD.encode(stop.stop_id.as_bytes());
        let stop_result = StopEntry {
            id,
            stop_id: stop.stop_id.clone(),
            stop_name: stop.stop_name.clone(),
            route_id: "NULL".to_string(),
            route_short_name: "NULL".to_string(),
        };
        output_stops.push(stop_result);
    }
    output_stops
}

#[tokio::main]
async fn main() {
    let client = Client::new(
        "http://localhost:7700",
        Some("disregard-shingle-steadier-nuclear"),
    )
    .unwrap();

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
    let query = "Gare";
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
