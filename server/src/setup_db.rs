use std::str::FromStr;

use models::{Agency, Calendar, CalendarDate, Route, Stop, Trip};
use services::{add_agencies, add_calendar_dates, add_calendars, add_routes, add_stops, add_trips};

extern crate diesel;
extern crate rocket;
pub mod models;
pub mod schema;
mod services;
pub mod tools;

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
        "AddAll" => Task::AddAll,
        _ => Task::Invalid,
    };
    let t1 = std::time::Instant::now();

    if task == Task::Invalid {
        println!("Invalid task");
        std::process::exit(1);
    }

    if task == Task::AddAgencies || task == Task::AddAll {
        let path = "src/data/agencies.txt";

        // add tasks to the database by batch of 1000
        get_entries!(path).chunks(CHUNK_SIZE).for_each(|chunk| {
            add_agencies(
                &chunk
                    .iter()
                    .map(|line| Agency::from_str(line).unwrap())
                    .collect::<Vec<Agency>>(),
            )
            .unwrap()
        })
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
        })
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
        })
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
        })
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
        })
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
        })
    }

    println!("Done!");
    println!("Elapsed time: {:?}", t1.elapsed());
}
