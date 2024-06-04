-- Your SQL goes here
CREATE TABLE
    agency (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url VARCHAR(255) NOT NULL,
        timezone VARCHAR(255) NOT NULL,
        lang VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
    );