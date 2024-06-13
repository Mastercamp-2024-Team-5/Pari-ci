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
    rocket::build()
        .attach(CORS)
        .mount("/", routes![index])
        .mount("/", routes![services::list_agency])
        .mount("/", routes![services::list_routes])
        .mount("/", routes![services::list_trips])
        .mount("/", routes![services::list_calendar])
        .mount("/", routes![services::list_calendar_dates])
        .mount("/", routes![services::get_stop,])
        .mount("/", routes![services::list_stop_times])
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
        .register("/", catchers![not_found])
}
