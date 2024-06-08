-- Your SQL goes here
CREATE TABLE
    stops (
        stop_id VARCHAR(255) PRIMARY KEY,
        stop_code VARCHAR(255),
        stop_name VARCHAR(255) NOT NULL,
        stop_desc VARCHAR(255),
        stop_lat FLOAT NOT NULL,
        stop_lon FLOAT NOT NULL,
        zone_id VARCHAR(255) NOT NULL,
        stop_url VARCHAR(255),
        location_type INTEGER NOT NULL,
        parent_station VARCHAR(255) NOT NULL,
        stop_timezone VARCHAR(255),
        level_id VARCHAR(255),
        wheelchair_boarding INTEGER NOT NULL,
        platform_code VARCHAR(255)
    );