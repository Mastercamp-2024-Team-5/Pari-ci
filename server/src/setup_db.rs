use services::{add_agencies, add_calendar_dates, add_calendars, add_routes, add_trips};

extern crate diesel;
extern crate rocket;
pub mod models;
pub mod schema;
mod services;
pub mod tools;

// // macro for adding and matching errors
// macro_rules! add_ignore_unique {
//     ($document:expr, $function:ident) => {
//         match services::$function($document) {
//             Ok(_) => (),
//             Err(e) => match e {
//                 diesel::result::Error::DatabaseError(
//                     diesel::result::DatabaseErrorKind::UniqueViolation,
//                     _,
//                 ) => (),
//                 _ => panic!("Error inserting document: {:?}", e),
//             },
//         }
//     };
// }

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

fn main() {
    let t1 = std::time::Instant::now();
    // read the agency.txt file from the data folder
    let path = "src/data/agency.txt";
    let mut agencies: Vec<models::Agency> = Vec::new();

    // iterate over the lines
    for line in get_entries!(path) {
        agencies.push(line.parse().unwrap());

        if agencies.len() == 1000 {
            print!(".");
            add_agencies(&agencies).unwrap();
            agencies.clear();
        }
    }
    add_agencies(&agencies).unwrap();

    // read the routes.txt file from the data folder
    let path = "src/data/routes.txt";
    let mut routes: Vec<models::Route> = Vec::new();

    // iterate over the lines
    for line in get_entries!(path) {
        // parse the line into a Route struct
        routes.push(line.parse().unwrap());

        // if the vector has 1000 elements, add them to the database
        if routes.len() == 1000 {
            print!(".");
            add_routes(&routes).unwrap();
            routes.clear();
        }
    }
    add_routes(&routes).unwrap();

    let path = "src/data/trips.txt";
    let mut trips: Vec<models::Trip> = Vec::new();

    for line in get_entries!(path) {
        trips.push(line.parse().unwrap());

        if trips.len() == 1000 {
            print!(".");
            add_trips(&trips).unwrap();
            trips.clear();
        }
    }
    add_trips(&trips).unwrap();

    let path = "src/data/calendar.txt";
    let mut calendars: Vec<models::Calendar> = Vec::new();

    for line in get_entries!(path) {
        calendars.push(line.parse().unwrap());

        if calendars.len() == 1000 {
            print!(".");
            add_calendars(&calendars).unwrap();
            calendars.clear();
        }
    }
    add_calendars(&calendars).unwrap();

    let path = "src/data/calendar_dates.txt";
    let mut calendar_dates: Vec<models::CalendarDate> = Vec::new();

    for line in get_entries!(path) {
        calendar_dates.push(line.parse().unwrap());

        if calendar_dates.len() == 1000 {
            print!(".");
            add_calendar_dates(&calendar_dates).unwrap();
            calendar_dates.clear();
        }
    }
    add_calendar_dates(&calendar_dates).unwrap();

    println!("Done!");
    println!("Elapsed time: {:?}", t1.elapsed());
}
