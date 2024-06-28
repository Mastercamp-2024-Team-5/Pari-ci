#![allow(dead_code)]
extern crate diesel;
extern crate rocket;
use crate::models;
use crate::schema;
use crate::views::services::PathNode;
use diesel::alias;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use rocket::get;
use rocket::options;
use rocket::post;
use rocket::response::status;
use rocket::response::status::BadRequest;
use rocket::response::status::NotFound;
use rocket::serde::json::Json;
use serde::Deserialize;
use serde::Serialize;
use std::env;
use time::OffsetDateTime;
use time::PrimitiveDateTime;

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
#[get("/routes?<metro>&<rer>&<tram>&<train>")]
pub fn list_routes(
    metro: Option<bool>,
    rer: Option<bool>,
    tram: Option<bool>,
    train: Option<bool>,
) -> Json<Vec<models::Route>> {
    use schema::routes::dsl::*;
    let connection = &mut establish_connection_pg();
    let mut results = routes.into_boxed();
    let mut filters = Vec::<i32>::new();
    if metro.unwrap_or(false) {
        filters.push(1);
    }
    if rer.unwrap_or(false) || train.unwrap_or(false) {
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
    if rer.unwrap_or(false) && !train.unwrap_or(false) {
        results = results.filter(agency_id.ne("IDFM:1046"));
    } else if train.unwrap_or(false) && !rer.unwrap_or(false) {
        results = results.filter(agency_id.eq("IDFM:1046"));
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

#[get("/trip/<id>")]
pub fn get_trip(id: &str) -> Json<Vec<models::Trip>> {
    use schema::trips::dsl::*;
    let connection = &mut establish_connection_pg();
    let results = trips
        .filter(trip_id.eq(id))
        .load::<models::Trip>(connection)
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
    use schema::routes::dsl as r_dsl;
    use schema::routes_trace::dsl as rt_dsl;
    let connection = &mut establish_connection_pg();
    let mut results = rt_dsl::routes_trace
        .inner_join(r_dsl::routes.on(r_dsl::route_id.eq(rt_dsl::route_id)))
        .into_boxed();

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
        filter.push(2)
    }
    if rer.unwrap_or(false) && !train.unwrap_or(false) {
        results = results.filter(r_dsl::agency_id.ne("IDFM:1046"));
    } else if train.unwrap_or(false) && !rer.unwrap_or(false) {
        results = results.filter(r_dsl::agency_id.eq("IDFM:1046"));
    }
    if filter.is_empty() {
        return Json(Vec::<models::RouteTrace>::new());
    }
    let results = results
        .filter(r_dsl::route_type.eq_any(filter))
        .select(rt_dsl::routes_trace::all_columns())
        .load::<models::RouteTrace>(connection)
        .expect("Error loading routes_trace");
    Json(results)
}

pub fn add_routes_trace(
    documents: &Vec<models::RouteTrace>,
) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_connection_pg();
    use schema::routes_trace::dsl::*;
    // Insert each document in the database because we want to skip documents with foreign key violation
    for document in documents {
        let result = diesel::insert_into(routes_trace)
            .values(document)
            .on_conflict_do_nothing()
            .execute(connection);

        if let Err(ref err) = result {
            // Handle foreign key violation error, log it and skip the document
            if let diesel::result::Error::DatabaseError(db_error_kind, _) = err {
                if *db_error_kind as u32
                    == diesel::result::DatabaseErrorKind::ForeignKeyViolation as u32
                {
                    continue;
                }
            }
            // Propagate other errors
            return result;
        }
    }
    Ok(1)
}

fn add_shared_trip(document: models::SharedTable) -> Result<(), diesel::result::Error> {
    use schema::shared_table::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(shared_table)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

fn get_shared_trip(document_id: &str) -> Result<models::SharedTable, diesel::result::Error> {
    use schema::shared_table::dsl::*;
    let connection = &mut establish_connection_pg();
    let result = shared_table
        .filter(id.eq(document_id))
        .first::<models::SharedTable>(connection);
    result
}

#[get("/share/<document_id>")]
pub fn get_share_trip(document_id: &str) -> Result<Json<SharedTrip>, NotFound<String>> {
    use schema::shared_table::dsl::*;
    let connection = &mut establish_connection_pg();
    let (stop_1, stop_2) = alias!(schema::stops as stop_1, schema::stops as stop_2);
    let result = shared_table
        .inner_join(stop_1.on(departure.eq(stop_1.fields(schema::stops::stop_id))))
        .inner_join(stop_2.on(destination.eq(stop_2.fields(schema::stops::stop_id))))
        .filter(id.eq(document_id))
        .select((
            departure,
            destination,
            start_date,
            end_date,
            content,
            stop_1.fields(schema::stops::stop_name),
            stop_2.fields(schema::stops::stop_name),
        ))
        .first::<(
            String,
            String,
            Option<PrimitiveDateTime>,
            Option<PrimitiveDateTime>,
            String,
            String,
            String,
        )>(connection);
    match result {
        Ok(shared_trip) => {
            let path_content: Result<(PrimitiveDateTime, Vec<PathNode>), serde_json::error::Error> =
                serde_json::from_str(&shared_trip.4);
            match path_content {
                Ok(path) => Ok(Json(SharedTrip {
                    departure: StopInfo {
                        id: shared_trip.0,
                        name: shared_trip.5,
                    },
                    destination: StopInfo {
                        id: shared_trip.1,
                        name: shared_trip.6,
                    },
                    start_date: shared_trip.2,
                    end_date: shared_trip.3,
                    content: path,
                })),
                Err(e) => Err(NotFound(format!(
                    "Error parsing shared trip content: {}",
                    e
                ))),
            }
        }
        Err(_) => Err(NotFound(format!(
            "No shared trip found with id {}",
            document_id
        ))),
    }
}

#[derive(Debug, Serialize)]
pub struct SharedTripResponse {
    id: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct StopInfo {
    id: String,
    name: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SharedTrip {
    departure: StopInfo,
    destination: StopInfo,
    start_date: Option<PrimitiveDateTime>,
    end_date: Option<PrimitiveDateTime>,
    content: (PrimitiveDateTime, Vec<PathNode>),
}

#[post("/share", data = "<document>", format = "json")]
pub fn post_share_trip(
    document: Json<SharedTrip>,
) -> Result<Json<SharedTripResponse>, NotFound<String>> {
    let document_id = uuid::Uuid::new_v4().as_simple().to_string();
    let datetime = OffsetDateTime::now_utc();
    let document = document.into_inner();
    let shared_trip = models::SharedTable {
        id: document_id.clone(),
        content: serde_json::to_string(&document.content).unwrap(),
        departure: document.departure.id,
        destination: document.destination.id,
        start_date: document.start_date,
        end_date: document.end_date,
        created_at: PrimitiveDateTime::new(datetime.date(), datetime.time()),
    };
    let result = add_shared_trip(shared_trip);
    match result {
        Ok(_) => Ok(Json(SharedTripResponse {
            id: document_id.clone(),
        })),
        Err(e) => Err(NotFound(format!("Error sharing trip: {}", e))),
    }
}

#[options("/share")]
pub fn options_share<'r>() -> status::Accepted<()> {
    status::Accepted(())
}

pub fn add_rating(document: models::Rating) -> Result<(), diesel::result::Error> {
    use schema::ratings::dsl::*;
    let connection = &mut establish_connection_pg();
    diesel::insert_into(ratings)
        .values(&document)
        .execute(connection)?;
    Ok(())
}

#[derive(Debug, Deserialize)]
pub struct RatingsRequest {
    rating: i32,
    trip_content: (PrimitiveDateTime, Vec<PathNode>),
}

#[post("/rate", data = "<document>", format = "json")]
pub fn post_rate_trip(document: Json<RatingsRequest>) -> Result<(), BadRequest<String>> {
    let document = document.into_inner();
    let content = serde_json::to_string(&document.trip_content);
    match content {
        Ok(trip_content) => Ok(add_rating(models::Rating {
            id: uuid::Uuid::new_v4().as_simple().to_string(),
            rating: document.rating,
            trip_content,
        })
        .unwrap()),
        Err(e) => Err(BadRequest(format!("Error parsing trip content: {}", e))),
    }
}

#[options("/rate")]
pub fn options_rate<'r>() -> status::Accepted<()> {
    status::Accepted(())
}
