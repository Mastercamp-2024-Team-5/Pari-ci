use super::schema::agency;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Insertable, Serialize, Deserialize)]
#[diesel(table_name = agency)]
pub struct Agency {
    pub id: i32,
    pub name: String,
    pub url: String,
    pub timezone: String,
    pub lang: String,
    pub phone: String,
    pub email: String,
}
