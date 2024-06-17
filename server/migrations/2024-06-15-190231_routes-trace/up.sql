-- Your SQL goes here
CREATE TABLE
    routes_trace (
        id VARCHAR(255) PRIMARY KEY,
        route_id VARCHAR(255) NOT NULL,
        route_type INTEGER NOT NULL,
        color VARCHAR(255),
        shape TEXT
    );