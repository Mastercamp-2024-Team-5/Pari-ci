-- Your SQL goes here
CREATE TABLE
    routes_trace (
        id VARCHAR(255) PRIMARY KEY,
        short_name VARCHAR(255) NOT NULL,
        long_name VARCHAR(255) NOT NULL,
        route_type INTEGER NOT NULL,
        color VARCHAR(255),
        route_url VARCHAR(255),
        shape TEXT,
        id_ilico VARCHAR(255),
        operator_name VARCHAR(255),
        network_name VARCHAR(255),
        url VARCHAR(255),
        long_name_first VARCHAR(255),
        geo_point_2d VARCHAR(255)
    );