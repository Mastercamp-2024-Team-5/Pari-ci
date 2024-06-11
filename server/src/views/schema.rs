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
