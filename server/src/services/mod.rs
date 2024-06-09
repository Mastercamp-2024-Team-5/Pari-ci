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

#[get("/calendar")]
pub fn list_calendar() -> Json<Vec<models::Calendar>> {
    use schema::calendar::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = calendar
        .load::<models::Calendar>(connection)
        .expect("Error loading calendar");
    Json(results)
}

pub fn add_calendar(document: models::Calendar) -> Result<(), diesel::result::Error> {
    use schema::calendar::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(calendar)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

pub fn add_calendars(documents: &Vec<models::Calendar>) -> Result<(), diesel::result::Error> {
    use schema::calendar::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(calendar)
        .values(documents)
        .on_conflict_do_nothing()
        .execute(connection)?;
    Ok(())
}

#[get("/calendar_dates")]
pub fn list_calendar_dates() -> Json<Vec<models::CalendarDate>> {
    use schema::calendar_dates::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = calendar_dates
        .load::<models::CalendarDate>(connection)
        .expect("Error loading calendar_dates");
    Json(results)
}

pub fn add_calendar_date(document: models::CalendarDate) -> Result<(), diesel::result::Error> {
    use schema::calendar_dates::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(calendar_dates)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

pub fn add_calendar_dates(
    documents: &Vec<models::CalendarDate>,
) -> Result<(), diesel::result::Error> {
    use schema::calendar_dates::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(calendar_dates)
        .values(documents)
        .on_conflict_do_nothing()
        .execute(connection)?;
    Ok(())
}

#[get("/stops")]
pub fn list_stops() -> Json<Vec<models::Stop>> {
    use schema::stops::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stops
        .load::<models::Stop>(connection)
        .expect("Error loading stops");
    Json(results)
}

pub fn add_stop(document: models::Stop) -> Result<(), diesel::result::Error> {
    use schema::stops::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(stops)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

pub fn add_stops(documents: &Vec<models::Stop>) -> Result<(), diesel::result::Error> {
    use schema::stops::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(stops)
        .values(documents)
        .on_conflict_do_nothing()
        .execute(connection)?;
    Ok(())
}

#[get("/stop_times")]
pub fn list_stop_times() -> Json<Vec<models::StopTime>> {
    use schema::stop_times::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stop_times
        .load::<models::StopTime>(connection)
        .expect("Error loading stop_times");
    Json(results)
}

pub fn add_stop_time(document: models::StopTime) -> Result<(), diesel::result::Error> {
    use schema::stop_times::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(stop_times)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

pub fn add_stop_times(documents: &Vec<models::StopTime>) -> Result<(), diesel::result::Error> {
    use schema::stop_times::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(stop_times)
        .values(documents)
        .execute(connection)?;
    Ok(())
}
