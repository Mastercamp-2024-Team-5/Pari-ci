use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Debug, Serialize, Deserialize)]
pub struct StopRouteDetails {
    pub stop_id: String,
    pub stop_name: String,
    pub stop_lat: f64,
    pub stop_lon: f64,
    pub location_type: i32,
    pub parent_station: String,
    pub wheelchair_boarding: i32,
    pub route_id: String,
    pub route_short_name: String,
    pub route_long_name: String,
    pub route_type: i32,
}

#[derive(Queryable, Debug, Serialize, Deserialize)]
pub struct AverageStopTime {
    pub stop_id: String,
    pub next_stop_id: String,
    pub avg_travel_time: i32,
}
