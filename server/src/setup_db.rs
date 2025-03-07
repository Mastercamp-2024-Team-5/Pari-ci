use std::str::FromStr;

use diesel::prelude::*;
use models::{Agency, Calendar, CalendarDate, Route, RouteTrace, Stop, StopTime, Transfer, Trip};
use serde::Deserialize;
use services::{
    add_agencies, add_calendar_dates, add_calendars, add_routes, add_routes_trace, add_stop_times,
    add_stops, add_transfers, add_trips, establish_connection_pg,
};
use views::services::refresh_materialized_view;

extern crate diesel;
extern crate rocket;
pub mod models;
pub mod schema;
mod services;
pub mod tools;
pub mod views;

// macro for opening a file and getting the contents
macro_rules! get_entries {
    ($path:expr) => {
        std::fs::read_to_string($path)
            .expect("Something went wrong reading the file")
            .split('\n')
            .skip(1) // skip the header
            .filter(|line| !line.is_empty()) // skip empty lines
            .collect::<Vec<&str>>()
    };
}

#[derive(Deserialize)]
struct Shape {
    coordinates: Vec<(f64, f64)>,
}

impl Shape {
    fn new(geojson: &str) -> Self {
        serde_json::from_str(geojson).unwrap()
    }
}

#[derive(PartialEq)]
enum Task {
    AddAgencies,
    AddRoutes,
    AddTrips,
    AddCalendars,
    AddCalendarDates,
    AddStops,
    AddStopTimes,
    AddTransfers,
    AddRoutesTrace,
    CorrectStopLocationWithTrace,
    AddAll,
    Invalid,
}

const CHUNK_SIZE: usize = 4096;

fn main() {
    // get arguments of the command line
    let args: Vec<String> = std::env::args().collect();
    if args.len() != 2 {
        println!("Usage: cargo run --bin setup_db <task>");
        std::process::exit(1);
    }
    let task = match args[1].as_str() {
        "AddAgencies" => Task::AddAgencies,
        "AddRoutes" => Task::AddRoutes,
        "AddTrips" => Task::AddTrips,
        "AddCalendars" => Task::AddCalendars,
        "AddCalendarDates" => Task::AddCalendarDates,
        "AddStops" => Task::AddStops,
        "AddStopTimes" => Task::AddStopTimes,
        "AddAll" => Task::AddAll,
        "AddTransfers" => Task::AddTransfers,
        "AddRoutesTrace" => Task::AddRoutesTrace,
        "CorrectStops" => Task::CorrectStopLocationWithTrace,
        _ => Task::Invalid,
    };
    let t1 = std::time::Instant::now();

    if task == Task::Invalid {
        println!("Invalid task");
        std::process::exit(1);
    }

    if task == Task::AddAgencies || task == Task::AddAll {
        let path = "src/data/agency.txt";

        // add tasks to the database by batch of 1000
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_agencies(
                &chunk
                    .iter()
                    .map(|line| Agency::from_str(line).unwrap())
                    .collect::<Vec<Agency>>(),
            )
            .unwrap()
        });
        println!("Agencies added");
    }
    if task == Task::AddRoutes || task == Task::AddAll {
        let path = "src/data/routes.txt";
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_routes(
                &chunk
                    .iter()
                    .map(|line| Route::from_str(line).unwrap())
                    .collect::<Vec<Route>>(),
            )
            .unwrap()
        });
        println!("Routes added");
    }
    if task == Task::AddTrips || task == Task::AddAll {
        let path = "src/data/trips.txt";
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_trips(
                &chunk
                    .iter()
                    .map(|line| Trip::from_str(line).unwrap())
                    .collect::<Vec<Trip>>(),
            )
            .unwrap()
        });
        println!("Trips added");
    }
    if task == Task::AddCalendars || task == Task::AddAll {
        let path = "src/data/calendar.txt";
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_calendars(
                &chunk
                    .iter()
                    .map(|line| Calendar::from_str(line).unwrap())
                    .collect::<Vec<Calendar>>(),
            )
            .unwrap()
        });
        println!("Calendars added");
    }
    if task == Task::AddCalendarDates || task == Task::AddAll {
        let path = "src/data/calendar_dates.txt";
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_calendar_dates(
                &chunk
                    .iter()
                    .map(|line| CalendarDate::from_str(line).unwrap())
                    .collect::<Vec<CalendarDate>>(),
            )
            .unwrap()
        });
        println!("Calendar dates added")
    }
    if task == Task::AddStops || task == Task::AddAll {
        let path = "src/data/stops.txt";
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_stops(
                &chunk
                    .iter()
                    .map(|line| Stop::from_str(line).unwrap())
                    .collect::<Vec<Stop>>(),
            )
            .unwrap()
        });
        println!("Stops added");
    }
    if task == Task::AddStopTimes || task == Task::AddAll {
        let path = "src/data/stop_times.txt";
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_stop_times(
                &chunk
                    .iter()
                    .map(|line| StopTime::from_str(line).unwrap())
                    .collect::<Vec<StopTime>>(),
            )
            .unwrap()
        });
        println!("Stop times added");
    }
    if task == Task::AddTransfers || task == Task::AddAll {
        let path = "src/data/transfers.txt";
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_transfers(
                &chunk
                    .iter()
                    .map(|line| Transfer::from_str(line).unwrap())
                    .collect::<Vec<Transfer>>(),
            )
            .unwrap()
        });
        println!("Transfers added");
    }
    if task == Task::AddRoutesTrace || task == Task::AddAll {
        let path = "src/data/routes_traces.txt";
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_routes_trace(
                &chunk
                    .iter()
                    .filter_map(|line| RouteTrace::from_str(line).ok())
                    .collect::<Vec<RouteTrace>>(),
            )
            .unwrap();
        });
        println!("Routes trace added");
    }

    // remove all data we don't need with cascade delete
    // remove all routes that are not in the list
    let conn = &mut establish_connection_pg();
    let routes_types = vec![0, 1, 2];
    let agency_ignored = "IDFM:93";
    use crate::schema::routes::dsl as routes_dsl;
    diesel::delete(
        routes_dsl::routes.filter(
            routes_dsl::route_type
                .ne_all(&routes_types)
                .or(routes_dsl::agency_id.eq(agency_ignored)),
        ),
    )
    .execute(conn)
    .expect("Error deleting routes");

    println!("Routes deleted");

    if task == Task::CorrectStopLocationWithTrace
        || task == Task::AddAll
        || task == Task::AddRoutesTrace
        || task == Task::AddStops
        || task == Task::AddRoutes
        || task == Task::AddTrips
        || task == Task::AddStopTimes
    {
        // correct the location of the stops with the trace of the routes
        let conn = &mut establish_connection_pg();
        use crate::schema::routes_trace::dsl as routes_trace_dsl;
        let traces = routes_trace_dsl::routes_trace
            .load::<RouteTrace>(conn)
            .expect("Error loading routes trace");

        use crate::views::schema::stop_route_details::dsl as stops_dsl;
        let stops_res: Vec<views::models::StopRouteDetails> = stops_dsl::stop_route_details
            .filter(stops_dsl::route_type.eq_any(&[0, 1, 2, 3]))
            .filter(stops_dsl::agency_id.eq_any(&[
                "IDFM:Operator_100",
                "IDFM:1046",
                "IDFM:93",
                "IDFM:71",
            ]))
            .load::<views::models::StopRouteDetails>(conn)
            .expect("Error loading stops");

        // parse the traces to keep only the first and last coordinates and the associated route
        let traces: Vec<(Vec<(f64, f64)>, String)> = traces
            .iter()
            .map(|trace| {
                let shape = trace.shape.clone().unwrap();
                let shape = Shape::new(&shape);
                let coordinates = shape.coordinates;
                let first = coordinates.first().unwrap();
                let last = coordinates.last().unwrap();
                (vec![first.clone(), last.clone()], trace.route_id.clone())
            })
            .collect();

        // for each stop, find the closest trace location and update the stop location
        for stop in stops_res {
            let stop_location = (stop.stop_lon, stop.stop_lat);
            let mut min_distance = f64::MAX;
            let mut closest_trace = (0_f64, 0_f64);
            for trace in traces.iter().filter(|trace| trace.1 == stop.route_id) {
                for coord in trace.0.iter() {
                    let distance = tools::haversine_distance(stop_location, *coord);
                    if distance < min_distance {
                        min_distance = distance;
                        closest_trace = *coord;
                    }
                }
            }
            // update the stop location
            use crate::schema::stops::dsl as stops_dsl;
            diesel::update(stops_dsl::stops.find(stop.stop_id))
                .set((
                    stops_dsl::stop_lon.eq(closest_trace.0),
                    stops_dsl::stop_lat.eq(closest_trace.1),
                ))
                .execute(conn)
                .expect("Error updating stop");
        }
        println!("Stops location corrected");
    }

    if task == Task::AddAll
        || task == Task::AddRoutes
        || task == Task::AddTrips
        || task == Task::AddStops
        || task == Task::AddStopTimes
        || task == Task::AddRoutesTrace
        || task == Task::CorrectStopLocationWithTrace
    {
        // refresh the materialized view
        refresh_materialized_view().unwrap();
        println!("Materialized view refreshed");
    }

    println!("Done!");
    println!("Elapsed time: {:?}", t1.elapsed());
}
