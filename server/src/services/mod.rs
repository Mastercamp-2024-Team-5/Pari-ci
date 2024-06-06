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
pub fn list_agency() -> Json<Vec<models::Agency>> {
    use schema::agency::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = agency
        .load::<models::Agency>(connection)
        .expect("Error loading agencies");
    Json(results)
}

// add a new agency to the database
pub fn add_agency(document: models::Agency) -> Result<(), diesel::result::Error> {
    use schema::agency::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(agency)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

// return a list of routes in JSON format
#[get("/routes")]
pub fn list_routes() -> Json<Vec<models::Route>> {
    use schema::routes::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = routes
        .load::<models::Route>(connection)
        .expect("Error loading routes");
    Json(results)
}

// add a new route to the database
pub fn add_route(document: models::Route) -> Result<(), diesel::result::Error> {
    use schema::routes::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(routes)
        .values(&document)
        .execute(connection)?;
    Ok(())
}
