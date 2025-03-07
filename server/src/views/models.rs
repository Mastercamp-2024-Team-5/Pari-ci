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
    pub agency_id: String,
}

#[derive(Queryable, Debug, Serialize, Deserialize)]
pub struct AverageStopTime {
    pub stop_id: String,
    pub next_stop_id: String,
    pub route_id: String,
    pub avg_travel_time: i32,
    pub wheelchair_accessible: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AverageStopTimeWithWait {
    pub stop_id: String,
    pub next_stop_id: String,
    pub route_id: String,
    pub avg_travel_time: i32,
    pub avg_wait_time: i32,
    pub trip_per_hour: Option<[i32; 30]>,
    pub pmr_compatible: bool,
}

#[derive(Queryable, Debug, Serialize, Deserialize)]
pub struct TripsBetweenStopsPerHour {
    pub stop_id1: String,
    pub stop_id2: String,
    pub hour: i32,
    pub trip_exists: i32,
}
