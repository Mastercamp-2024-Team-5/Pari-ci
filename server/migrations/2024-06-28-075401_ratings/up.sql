-- Your SQL goes here
CREATE TABLE
    ratings (
        id VARCHAR(255) PRIMARY KEY,
        rating INT NOT NULL,
        trip_content TEXT NOT NULL
    );