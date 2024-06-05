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
    routes (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        agency_id -> Varchar,
        #[max_length = 255]
        short_name -> Varchar,
        long_name -> Text,
        description -> Nullable<Text>,
        #[sql_name = "type"]
        type_ -> Int4,
        #[max_length = 255]
        url -> Nullable<Varchar>,
        #[max_length = 255]
        color -> Nullable<Varchar>,
        #[max_length = 255]
        text_color -> Nullable<Varchar>,
        sort_order -> Nullable<Int4>,
    }
}

diesel::joinable!(routes -> agency (agency_id));

diesel::allow_tables_to_appear_in_same_query!(
    agency,
    routes,
);
