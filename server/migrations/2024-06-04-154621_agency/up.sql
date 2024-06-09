-- Your SQL goes here
CREATE TABLE
    agency (
        agency_id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        url VARCHAR(255) NOT NULL,
        timezone VARCHAR(255) NOT NULL,
        lang VARCHAR(255),
        phone VARCHAR(255),
        email VARCHAR(255),
        fare_url VARCHAR(255)
    );