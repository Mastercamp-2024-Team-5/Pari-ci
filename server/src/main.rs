#[macro_use]
extern crate rocket;

use rocket::response::stream::TextStream;
use rocket::tokio::time::{interval, Duration};
use rocket::Request;
pub mod models;
pub mod schema;
mod services;
pub mod tools;
pub mod views;
use rocket::http::Header;
use rocket::Response;
use rocket::fairing::{Fairing, Info, Kind};

pub struct CORS;
#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "CORS",
            kind: Kind::Response
        }
    }

    async fn on_response<'r>(&self, _req: &'r Request<'_>, res: &mut Response<'r>) {
        res.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        res.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, OPTIONS"));
        res.set_header(Header::new("Access-Control-Allow-Headers", "Content-Type"));
    }
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

/// Produce an infinite series of `"hello"`s, one per second.
#[get("/infinite-hellos")]
fn hello() -> TextStream![&'static str] {
    TextStream! {
        let mut interval = interval(Duration::from_secs(1));
        loop {
            yield "hello";
            interval.tick().await;
        }
    }
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
        .mount("/", routes![hello])
        .mount("/", routes![services::list_agency])
        .mount("/", routes![services::list_routes])
        .mount("/", routes![services::list_trips])
        .mount("/", routes![services::list_calendar_dates])
        .mount("/", routes![services::list_calendar])
        .mount("/", routes![services::list_stops, services::get_stop])
        .mount("/", routes![services::list_stop_times])
        .mount("/", routes![views::services::list_metro_stops])
        .mount("/", routes![views::services::list_metro_stops_transfers])
        .register("/", catchers![not_found])
}
