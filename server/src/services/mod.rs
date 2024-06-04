extern crate diesel;
extern crate rocket;
use crate::models;
use crate::schema;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use rocket::get;
use rocket::serde::json::Json;
use std::env;

pub fn establish_connection_pg() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

// return a list of agencies in JSON format
#[get("/agencies")]
pub fn list() -> Json<Vec<models::Agency>> {
    use schema::agency::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = agency
        .load::<models::Agency>(connection)
        .expect("Error loading agencies");
    Json(results)
}
