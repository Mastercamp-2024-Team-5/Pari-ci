#[macro_use]
extern crate rocket;

use rocket::Request;
pub mod models;
pub mod schema;
mod services;
pub mod tools;
pub mod views;
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::Response;
use tools::graph;
use views::services::{get_average_times, get_average_transfert_times};

pub struct CORS;
#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "CORS",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _req: &'r Request<'_>, res: &mut Response<'r>) {
        res.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        res.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, OPTIONS",
        ));
        res.set_header(Header::new("Access-Control-Allow-Headers", "Content-Type"));
    }
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[catch(404)]
fn not_found(req: &Request) -> String {
    format!("Sorry, '{}' is not a valid path.", req.uri())
}

#[launch]
fn rocket() -> _ {
    println!("Generating graph...");
    let mut average_stop_times = get_average_times();
    average_stop_times.append(&mut get_average_transfert_times());
    let g = graph::Graph::generate_graph(average_stop_times);

    println!("Starting server...");
    rocket::build()
        .attach(CORS)
        .manage(g)
        .mount("/", routes![index])
        .mount("/", routes![services::list_agency])
        .mount("/", routes![services::list_routes])
        .mount("/", routes![services::list_trips])
        .mount("/", routes![services::list_calendar])
        .mount("/", routes![services::list_calendar_dates])
        .mount("/", routes![services::get_stop,])
        .mount("/", routes![services::list_stop_times])
        .mount("/", routes![services::list_routes_trace])
        .mount(
            "/",
            routes![
                views::services::list_stops,
                views::services::get_stop_details
            ],
        )
        .mount("/", routes![views::services::list_metro_stops_transfers])
        .mount(
            "/",
            routes![
                views::services::get_average_stop_times,
                views::services::list_average_stop_times
            ],
        )
        .mount("/", routes![views::services::list_sorted_stops])
        .mount(
            "/",
            routes![views::services::get_path, views::services::get_fast_path],
        )
        .register("/", catchers![not_found])
}
