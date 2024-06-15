use crate::schema::*;

diesel::table! {
    stop_route_details (stop_id) {
        stop_id -> Varchar,
        stop_name -> Varchar,
        stop_lat -> Float8,
        stop_lon -> Float8,
        location_type -> Int4,
        parent_station -> Varchar,
        wheelchair_boarding -> Int4,
        route_id -> Varchar,
        route_short_name -> Varchar,
        route_long_name -> Varchar,
        route_type -> Int4,
    }
}

diesel::table! {
    average_stop_times (stop_id) {
        stop_id -> Varchar,
        next_stop_id -> Varchar,
        avg_travel_time -> Int4,
    }
}

diesel::joinable!(stop_route_details -> routes (route_id));
diesel::joinable!(stop_route_details -> stops (stop_id));
diesel::joinable!(stop_route_details -> trips (route_id));
diesel::joinable!(transfers -> stop_route_details (from_stop_id));

diesel::allow_tables_to_appear_in_same_query!(transfers, stop_route_details, average_stop_times);
diesel::allow_tables_to_appear_in_same_query!(stop_route_details, stop_times);
