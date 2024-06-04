// @generated automatically by Diesel CLI.

diesel::table! {
    agency (id) {
        id -> Int4,
        name -> Text,
        #[max_length = 255]
        url -> Varchar,
        #[max_length = 255]
        timezone -> Varchar,
        #[max_length = 255]
        lang -> Varchar,
        #[max_length = 255]
        phone -> Varchar,
        #[max_length = 255]
        email -> Varchar,
    }
}
