-- Your SQL goes here
CREATE TABLE
    shared_table (
        id VARCHAR(36) PRIMARY KEY,
        content TEXT NOT NULL,
        departure VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (departure) REFERENCES stops (stop_id),
        FOREIGN KEY (destination) REFERENCES stops (stop_id)
    );