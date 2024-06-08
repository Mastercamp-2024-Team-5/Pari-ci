-- Your SQL goes here
CREATE TABLE
    calendar_dates (
        service_id VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        exception_type INT NOT NULL,
        PRIMARY KEY (service_id, date),
        FOREIGN KEY (service_id) REFERENCES trips (service_id)
    );