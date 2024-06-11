-- Your SQL goes here
CREATE TABLE
    trips (
        route_id VARCHAR(255) NOT NULL,
        service_id VARCHAR(255) NOT NULL,
        trip_id VARCHAR(255) NOT NULL,
        headsign VARCHAR(255) NOT NULL,
        short_name VARCHAR(255),
        direction_id INT NOT NULL,
        block_id VARCHAR(255),
        shape_id VARCHAR(255),
        wheelchair_accessible INT NOT NULL,
        bikes_allowed INT NOT NULL,
        PRIMARY KEY (trip_id),
        FOREIGN KEY (route_id) REFERENCES routes (route_id)
        -- FOREIGN KEY (service_id) REFERENCES calendar (service_id) -- removed because key some times not exists
    );