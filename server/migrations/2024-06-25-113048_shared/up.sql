-- Your SQL goes here
CREATE TABLE
    shared_table (
        id VARCHAR(36) PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );