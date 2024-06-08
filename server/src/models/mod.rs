use std::str::FromStr;

use super::schema::agency;
use super::schema::calendar;
use super::schema::calendar_dates;
use super::schema::routes;
use super::schema::stops;
use super::schema::trips;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use time::format_description;
use time::Date;

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

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = calendar)]
pub struct Calendar {
    pub service_id: String,
    pub days: i32,
    pub start_date: Date,
    pub end_date: Date,
}

impl FromStr for Calendar {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.split(',').collect();
        let format = format_description::parse("[year][month][day]").unwrap();

        if parts.len() != 10 {
            println!("Invalid number of fields: {}", parts.len());
            return Err(());
        }

        let start_date = Date::parse(parts[8], &format).unwrap();
        let end_date = Date::parse(parts[9], &format).unwrap();

        let days: i32 = parts[1..8].iter().enumerate().fold(0, |acc, (i, day)| {
            acc + day.parse::<i32>().unwrap() * 2_i32.pow(i as u32)
        });

        Ok(Self {
            service_id: parts[0].parse().unwrap(),
            days,
            start_date,
            end_date,
        })
    }
}

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = calendar_dates)]
pub struct CalendarDate {
    pub service_id: String,
    pub date: Date,
    pub exception_type: i32,
}

impl FromStr for CalendarDate {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.split(',').collect();
        let format = format_description::parse("[year][month][day]").unwrap();

        if parts.len() != 3 {
            println!("Invalid number of fields: {}", parts.len());
            return Err(());
        }

        let date = Date::parse(parts[1], &format).unwrap();

        Ok(Self {
            service_id: parts[0].parse().unwrap(),
            date,
            exception_type: parts[2].parse().unwrap(),
        })
    }
}

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = stops)]
pub struct Stop {
    pub stop_id: String,
    pub stop_code: Option<String>,
    pub stop_name: String,
    pub stop_desc: Option<String>,
    pub stop_lat: f64,
    pub stop_lon: f64,
    pub zone_id: String,
    pub stop_url: Option<String>,
    pub location_type: i32,
    pub parent_station: String,
    pub stop_timezone: Option<String>,
    pub level_id: Option<String>,
    pub wheelchair_boarding: i32,
    pub platform_code: Option<String>,
}

impl FromStr for Stop {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.split(',').collect();
        let parts = combine_parts(parts);
        if parts.len() != 14 {
            println!("Invalid number of fields: {}", parts.len());
            println!("{:?}", parts);
            return Err(());
        }

        // if field is empty, set it to None
        let stop_code = if parts[1].is_empty() {
            None
        } else {
            Some(parts[1].to_string())
        };
        let stop_desc = if parts[3].is_empty() {
            None
        } else {
            Some(parts[3].to_string())
        };
        let stop_url = if parts[7].is_empty() {
            None
        } else {
            Some(parts[7].to_string())
        };
        let stop_timezone = if parts[10].is_empty() {
            None
        } else {
            Some(parts[10].to_string())
        };
        let level_id = if parts[11].is_empty() {
            None
        } else {
            Some(parts[11].to_string())
        };
        let platform_code = if parts[12].is_empty() {
            None
        } else {
            Some(parts[12].to_string())
        };

        Ok(Self {
            stop_id: parts[0].parse().unwrap(),
            stop_code,
            stop_name: parts[2].to_string(),
            stop_desc,
            stop_lat: parts[4].parse().unwrap(),
            stop_lon: parts[5].parse().unwrap(),
            zone_id: parts[6].to_string(),
            stop_url,
            location_type: parts[8].parse().unwrap(),
            parent_station: parts[9].to_string(),
            stop_timezone,
            level_id,
            wheelchair_boarding: parts[12].parse().unwrap(),
            platform_code,
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
