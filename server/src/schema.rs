// @generated automatically by Diesel CLI.

diesel::table! {
    agency (agency_id) {
        #[max_length = 255]
        agency_id -> Varchar,
        name -> Text,
        #[max_length = 255]
        url -> Varchar,
        #[max_length = 255]
        timezone -> Varchar,
        #[max_length = 255]
        lang -> Nullable<Varchar>,
        #[max_length = 255]
        phone -> Nullable<Varchar>,
        #[max_length = 255]
        email -> Nullable<Varchar>,
        #[max_length = 255]
        fare_url -> Nullable<Varchar>,
    }
}

diesel::table! {
    calendar (service_id) {
        #[max_length = 255]
        service_id -> Varchar,
        days -> Int4,
        start_date -> Date,
        end_date -> Date,
    }
}

diesel::table! {
    calendar_dates (service_id, date) {
        #[max_length = 255]
        service_id -> Varchar,
        date -> Date,
        exception_type -> Int4,
    }
}

diesel::table! {
    routes (route_id) {
        #[max_length = 255]
        route_id -> Varchar,
        #[max_length = 255]
        agency_id -> Varchar,
        #[max_length = 255]
        short_name -> Varchar,
        long_name -> Text,
        description -> Nullable<Text>,
        route_type -> Int4,
        #[max_length = 255]
        url -> Nullable<Varchar>,
        #[max_length = 255]
        color -> Nullable<Varchar>,
        #[max_length = 255]
        text_color -> Nullable<Varchar>,
        sort_order -> Nullable<Int4>,
    }
}

diesel::table! {
    stop_times (trip_id, stop_id, stop_sequence, arrival_time, departure_time) {
        #[max_length = 255]
        trip_id -> Varchar,
        arrival_time -> Int4,
        departure_time -> Int4,
        #[max_length = 255]
        stop_id -> Varchar,
        stop_sequence -> Int4,
        pickup_type -> Int4,
        drop_off_type -> Int4,
        #[max_length = 255]
        local_zone_id -> Nullable<Varchar>,
        #[max_length = 255]
        stop_headsign -> Nullable<Varchar>,
        timepoint -> Int4,
    }
}

diesel::table! {
    stops (stop_id) {
        #[max_length = 255]
        stop_id -> Varchar,
        #[max_length = 255]
        stop_code -> Nullable<Varchar>,
        #[max_length = 255]
        stop_name -> Varchar,
        #[max_length = 255]
        stop_desc -> Nullable<Varchar>,
        stop_lat -> Float8,
        stop_lon -> Float8,
        #[max_length = 255]
        zone_id -> Varchar,
        #[max_length = 255]
        stop_url -> Nullable<Varchar>,
        location_type -> Int4,
        #[max_length = 255]
        parent_station -> Varchar,
        #[max_length = 255]
        stop_timezone -> Nullable<Varchar>,
        #[max_length = 255]
        level_id -> Nullable<Varchar>,
        wheelchair_boarding -> Int4,
        #[max_length = 255]
        platform_code -> Nullable<Varchar>,
    }
}

diesel::table! {
    transfers (from_stop_id, to_stop_id) {
        #[max_length = 255]
        from_stop_id -> Varchar,
        #[max_length = 255]
        to_stop_id -> Varchar,
        min_transfer_time -> Int4,
    }
}

diesel::table! {
    trips (trip_id) {
        #[max_length = 255]
        route_id -> Varchar,
        #[max_length = 255]
        service_id -> Varchar,
        #[max_length = 255]
        trip_id -> Varchar,
        #[max_length = 255]
        headsign -> Varchar,
        #[max_length = 255]
        short_name -> Nullable<Varchar>,
        direction_id -> Int4,
        #[max_length = 255]
        block_id -> Nullable<Varchar>,
        #[max_length = 255]
        shape_id -> Nullable<Varchar>,
        wheelchair_accessible -> Int4,
        bikes_allowed -> Int4,
    }
}

diesel::joinable!(routes -> agency (agency_id));
diesel::joinable!(stop_times -> stops (stop_id));
diesel::joinable!(stop_times -> trips (trip_id));
diesel::joinable!(trips -> routes (route_id));

diesel::allow_tables_to_appear_in_same_query!(
    agency,
    calendar,
    calendar_dates,
    routes,
    stop_times,
    stops,
    transfers,
    trips,
);
