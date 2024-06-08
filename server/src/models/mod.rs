use std::str::FromStr;

use super::schema::agency;
use super::schema::routes;
use super::schema::trips;
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

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = trips)]
pub struct Trip {
    pub route_id: String,
    pub service_id: String,
    pub trip_id: String,
    pub headsign: String,
    pub short_name: Option<String>,
    pub direction_id: i32,
    pub block_id: Option<String>,
    pub shape_id: Option<String>,
    pub wheelchair_accessible: i32,
    pub bikes_allowed: i32,
}

impl FromStr for Trip {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.split(',').collect();
        let parts = combine_parts(parts);

        // if field is empty, set it to None
        let short_name = if parts[4].is_empty() {
            None
        } else {
            Some(parts[4].to_string())
        };
        let block_id = if parts[6].is_empty() {
            None
        } else {
            Some(parts[6].to_string())
        };
        let shape_id = if parts[7].is_empty() {
            None
        } else {
            Some(parts[7].to_string())
        };

        Ok(Self {
            route_id: parts[0].parse().unwrap(),
            service_id: parts[1].parse().unwrap(),
            trip_id: parts[2].parse().unwrap(),
            headsign: parts[3].to_string(),
            short_name,
            direction_id: parts[5].parse().unwrap(),
            block_id,
            shape_id,
            wheelchair_accessible: parts[8].parse().unwrap(),
            bikes_allowed: parts[9].parse().unwrap(),
        })
    }
}

// return the vector with parts wrapped in quotes combined
fn combine_parts(parts: Vec<&str>) -> Vec<String> {
    let mut combined_parts = Vec::new();
    let mut combined = String::new();
    let mut in_quotes = false;

    for part in parts {
        if in_quotes {
            combined.push_str(part);
            if part.ends_with('"') {
                in_quotes = false;
                combined_parts.push(combined.clone());
                combined.clear();
            } else {
                combined.push(',');
            }
        } else {
            if part.starts_with('"') {
                in_quotes = true;
                combined.push_str(part);
            } else {
                combined_parts.push(part.to_string());
            }
        }
    }
    combined_parts
}
