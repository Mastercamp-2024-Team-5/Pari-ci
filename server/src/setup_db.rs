extern crate diesel;
extern crate rocket;
pub mod models;
pub mod schema;
mod services;

fn main() {
    // read the agency.txt file from the data folder
    let path = "src/data/agency.txt";
    let contents = std::fs::read_to_string(path).expect("Something went wrong reading the file");

    // split the contents by new line
    let lines: Vec<&str> = contents.split('\n').collect();

    // remove the first line
    let lines = &lines[1..];

    // iterate over the lines
    for line in lines {
        if line.is_empty() {
            continue;
        }

        // parse the line into an Agency struct
        let agency: models::Agency = line.parse().unwrap();

        // insert the agency into the database
        services::add(agency).unwrap();
    }

    println!("Done!");
}
