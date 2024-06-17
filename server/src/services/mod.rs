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
#[get("/routes?<metro>&<rer>&<tram>")]
pub fn list_routes(
    metro: Option<bool>,
    rer: Option<bool>,
    tram: Option<bool>,
) -> Json<Vec<models::Route>> {
    use schema::routes::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = routes.into_boxed();
    let mut filters = Vec::<i32>::new();
    if metro.unwrap_or(false) {
        filters.push(1);
    }
    if rer.unwrap_or(false) {
        filters.push(2);
    }
    if tram.unwrap_or(false) {
        filters.push(0);
    }
    if filters.is_empty() {
        // send everything
        return Json(
            results
                .load::<models::Route>(connection)
                .expect("Error loading routes"),
        );
    }
    let results = results
        .filter(route_type.eq_any(filters))
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

#[get("/stop/<id>")]
pub fn get_stop(id: &str) -> Json<Vec<models::Stop>> {
    use schema::stops::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = stops
        .filter(stop_id.eq(id))
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
        .on_conflict_do_nothing()
        .execute(connection)?;
    Ok(())
}

pub fn list_transfers() -> Json<Vec<models::Transfer>> {
    use schema::transfers::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = transfers
        .load::<models::Transfer>(connection)
        .expect("Error loading transfers");
    Json(results)
}

pub fn add_transfer(document: models::Transfer) -> Result<(), diesel::result::Error> {
    use schema::transfers::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(transfers)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

pub fn add_transfers(documents: &Vec<models::Transfer>) -> Result<(), diesel::result::Error> {
    use schema::transfers::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(transfers)
        .values(documents)
        .on_conflict_do_nothing()
        .execute(connection)?;
    Ok(())
}

#[get("/routes_trace?<metro>&<rer>&<tram>&<train>")]
pub fn list_routes_trace(
    metro: Option<bool>,
    rer: Option<bool>,
    tram: Option<bool>,
    train: Option<bool>,
) -> Json<Vec<models::RouteTrace>> {
    let mut filter = Vec::<i32>::new();
    if metro.unwrap_or(false) {
        filter.push(1);
    }
    if rer.unwrap_or(false) {
        filter.push(2);
    }
    if tram.unwrap_or(false) {
        filter.push(0);
    }
    if train.unwrap_or(false) {
        filter.push(3)
    }
    if filter.is_empty() {
        return Json(Vec::<models::RouteTrace>::new());
    }
    use schema::routes_trace::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = routes_trace
        .filter(route_type.eq_any(filter))
        .load::<models::RouteTrace>(connection)
        .expect("Error loading routes_trace");
    Json(results)
}

pub fn add_routes_trace(documents: &Vec<models::RouteTrace>) -> Result<(), diesel::result::Error> {
    use schema::routes_trace::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(routes_trace)
        .values(documents)
        .on_conflict_do_nothing()
        .execute(connection)?;
    Ok(())
}
