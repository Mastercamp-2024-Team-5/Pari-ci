-- Your SQL goes here
CREATE TABLE
    transfers (
        from_stop_id VARCHAR(255) NOT NULL,
        to_stop_id VARCHAR(255) NOT NULL,
        min_transfer_time INT NOT NULL,
        PRIMARY KEY (from_stop_id, to_stop_id),
        FOREIGN KEY (from_stop_id) REFERENCES stops (stop_id),
        FOREIGN KEY (to_stop_id) REFERENCES stops (stop_id)
    );