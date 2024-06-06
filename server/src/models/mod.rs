use std::str::FromStr;

use super::schema::agency;
use super::schema::routes;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = agency)]
pub struct Agency {
    pub id: String,
    pub name: String,
    pub url: String,
    pub timezone: String,
    pub lang: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub fare_url: Option<String>,
}

impl FromStr for Agency {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.split(',').collect();
        if parts.len() != 8 {
            println!("Invalid number of fields: {}", parts.len());
            return Err(());
        }

        // if field is empty, set it to None
        let lang = if parts[4].is_empty() {
            None
        } else {
            Some(parts[4].to_string())
        };
        let phone = if parts[5].is_empty() {
            None
        } else {
            Some(parts[5].to_string())
        };
        let email = if parts[6].is_empty() {
            None
        } else {
            Some(parts[6].to_string())
        };

        let fare_url = if parts[7].is_empty() {
            None
        } else {
            Some(parts[7].to_string())
        };

        Ok(Self {
            id: parts[0].parse().unwrap(),
            name: parts[1].to_string(),
            url: parts[2].to_string(),
            timezone: parts[3].to_string(),
            lang,
            phone,
            email,
            fare_url,
        })
    }
}

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = routes)]
pub struct Route {
    pub id: String,
    pub agency_id: String,
    pub short_name: String,
    pub long_name: String,
    pub description: Option<String>,
    pub route_type: i32,
    pub url: Option<String>,
    pub color: Option<String>,
    pub text_color: Option<String>,
    pub sort_order: Option<i32>,
}

impl FromStr for Route {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.split(',').collect();
        if parts.len() != 10 {
            println!("Invalid number of fields: {}", parts.len());
            return Err(());
        }

        // if field is empty, set it to None
        let description = if parts[5].is_empty() {
            None
        } else {
            Some(parts[4].to_string())
        };
        let url = if parts[6].is_empty() {
            None
        } else {
            Some(parts[6].to_string())
        };
        let color = if parts[7].is_empty() {
            None
        } else {
            Some(parts[7].to_string())
        };
        let text_color = if parts[8].is_empty() {
            None
        } else {
            Some(parts[8].to_string())
        };
        let sort_order = if parts[9].is_empty() {
            None
        } else {
            Some(parts[9].parse().unwrap())
        };

        Ok(Self {
            id: parts[0].parse().unwrap(),
            agency_id: parts[1].parse().unwrap(),
            short_name: parts[2].to_string(),
            long_name: parts[3].to_string(),
            description,
            route_type: parts[5].parse().unwrap(),
            url,
            color,
            text_color,
            sort_order,
        })
    }
}
