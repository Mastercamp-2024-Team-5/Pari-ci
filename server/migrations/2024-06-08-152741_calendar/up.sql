-- Your SQL goes here
CREATE TABLE
    calendar (
        service_id VARCHAR(255),
        days INT NOT NULL, -- bit mask of days of the week
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        PRIMARY KEY (service_id),
        FOREIGN KEY (service_id) REFERENCES trips (service_id)
    )