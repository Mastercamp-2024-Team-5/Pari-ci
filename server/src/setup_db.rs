use std::str::FromStr;

use diesel::prelude::*;
use models::{Agency, Calendar, CalendarDate, Route, RouteTrace, Stop, StopTime, Transfer, Trip};
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
        "CorrectStop" => Task::CorrectStopLocationWithTrace,
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
                    // .filter(|agency| {
                    //     agency.agency_id == "IDFM:Operator_100"
                    //         || agency.agency_id == "IDFM:1046"
                    //         || agency.agency_id == "IDFM:93"
                    //         || agency.agency_id == "IDFM:71"
                    // })
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
                    .map(|line| RouteTrace::from_str(line).unwrap())
                    .collect::<Vec<RouteTrace>>(),
            )
            .unwrap()
        });
        println!("Routes added");
    }

    if task == Task::AddAll
        || task == Task::AddRoutes
        || task == Task::AddTrips
        || task == Task::AddStops
        || task == Task::AddStopTimes
    {
        // refresh the materialized view
        refresh_materialized_view().unwrap();
        println!("Materialized view refreshed");
    }

    if task == Task::CorrectStopLocationWithTrace {
        // correct the location of the stops with the trace of the routes
        let conn = &mut establish_connection_pg();
        use crate::schema::routes_trace::dsl as routes_trace_dsl;
        let traces = routes_trace_dsl::routes_trace
            .load::<RouteTrace>(conn)
            .expect("Error loading routes trace");

        use crate::views::schema::stop_route_details::dsl as stops_dsl;
        let stops_res = stops_dsl::stop_route_details
            .filter(stops_dsl::route_type.eq_any(&[0, 1, 2, 3]))
            .filter(stops_dsl::agency_id.eq_any(&[
                "IDFM:Operator_100",
                "IDFM:1046",
                "IDFM:93",
                "IDFM:71",
            ]))
            .load::<views::models::StopRouteDetails>(conn)
            .expect("Error loading stops");
    }

    println!("Done!");
    println!("Elapsed time: {:?}", t1.elapsed());
}
