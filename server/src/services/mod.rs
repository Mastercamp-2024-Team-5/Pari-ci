#![allow(dead_code)]
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

pub fn add_agencies(documents: &Vec<models::Agency>) -> Result<(), diesel::result::Error> {
    use schema::agency::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(agency)
        .values(documents)
        .on_conflict_do_nothing()
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

pub fn add_routes(documents: &Vec<models::Route>) -> Result<(), diesel::result::Error> {
    use schema::routes::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(routes)
        .values(documents)
        .on_conflict_do_nothing()
        .execute(connection)?;
    Ok(())
}

// return a list of trips in JSON format
#[get("/trips")]
pub fn list_trips() -> Json<Vec<models::Trip>> {
    use schema::trips::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = trips
        .load::<models::Trip>(connection)
        .expect("Error loading trips");
    Json(results)
}

// add a new trip to the database
pub fn add_trip(document: models::Trip) -> Result<(), diesel::result::Error> {
    use schema::trips::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(trips)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

pub fn add_trips(documents: &Vec<models::Trip>) -> Result<(), diesel::result::Error> {
    use schema::trips::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(trips)
        .values(documents)
        .on_conflict_do_nothing()
        .execute(connection)?;
    Ok(())
}
