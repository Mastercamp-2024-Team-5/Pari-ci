-- Your SQL goes here
CREATE TABLE
    routes (
        id VARCHAR(255) PRIMARY KEY,
        agency_id VARCHAR(255) NOT NULL,
        short_name VARCHAR(255) NOT NULL,
        long_name TEXT NOT NULL,
        description TEXT,
        type INTEGER NOT NULL,
        url VARCHAR(255),
        color VARCHAR(255),
        text_color VARCHAR(255),
        sort_order INTEGER,
        FOREIGN KEY (agency_id) REFERENCES agency (id)
    );