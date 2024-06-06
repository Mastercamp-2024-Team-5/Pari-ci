extern crate diesel;
extern crate rocket;
pub mod models;
pub mod schema;
mod services;

// macro for adding and matching errors
macro_rules! add_ignore_unique {
    ($document:expr, $function:ident) => {
        match services::$function($document) {
            Ok(_) => (),
            Err(e) => match e {
                diesel::result::Error::DatabaseError(
                    diesel::result::DatabaseErrorKind::UniqueViolation,
                    _,
                ) => (),
                _ => panic!("Error inserting document: {:?}", e),
            },
        }
    };
}

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
    // read the agency.txt file from the data folder
    let path = "src/data/agency.txt";

    // iterate over the lines
    for line in get_entries!(path) {
        // parse the line into an Agency struct
        let agency: models::Agency = line.parse().unwrap();

        add_ignore_unique!(agency, add_agency);
    }

    // read the routes.txt file from the data folder
    let path = "src/data/routes.txt";

    // iterate over the lines
    for line in get_entries!(path) {
        // parse the line into a Route struct
        let route: models::Route = line.parse().unwrap();

        // insert the route into the database
        add_ignore_unique!(route, add_route);
    }

    println!("Done!");
}
