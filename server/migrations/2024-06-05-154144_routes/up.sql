-- Your SQL goes here
CREATE TABLE
    routes (
        route_id VARCHAR(255) PRIMARY KEY,
        agency_id VARCHAR(255) NOT NULL,
        short_name VARCHAR(255) NOT NULL,
        long_name TEXT NOT NULL,
        description TEXT,
        route_type INTEGER NOT NULL,
        url VARCHAR(255),
        color VARCHAR(255),
        text_color VARCHAR(255),
        sort_order INTEGER,
        FOREIGN KEY (agency_id) REFERENCES agency (agency_id) ON DELETE CASCADE
    );