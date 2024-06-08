// @generated automatically by Diesel CLI.

diesel::table! {
    agency (id) {
        #[max_length = 255]
        id -> Varchar,
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
    routes (id) {
        #[max_length = 255]
        id -> Varchar,
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
diesel::joinable!(trips -> routes (route_id));

diesel::allow_tables_to_appear_in_same_query!(
    agency,
    calendar,
    calendar_dates,
    routes,
    trips,
);
