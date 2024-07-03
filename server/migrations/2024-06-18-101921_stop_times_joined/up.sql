-- Your SQL goes here
CREATE MATERIALIZED VIEW stop_times_joined AS
SELECT
    t1.trip_id,
    t1.arrival_time AS arrival_time1,
    t2.arrival_time AS arrival_time2,
    t1.departure_time AS departure_time1,
    t2.departure_time AS departure_time2,
    t1.stop_id AS stop_id1,
    t2.stop_id AS stop_id2
FROM
    stop_times t1
    JOIN stop_times t2 ON t1.trip_id = t2.trip_id
WHERE
    t1.stop_sequence = t2.stop_sequence - 1
    AND t1.stop_id != t2.stop_id;

CREATE INDEX stop_times_joined_stop_id1_idx ON stop_times_joined (stop_id1);

CREATE INDEX stop_times_joined_stop_id2_idx ON stop_times_joined (stop_id2);

CREATE INDEX stop_times_joined_trip_id_idx ON stop_times_joined (trip_id);

CREATE INDEX stop_times_joined_arrival_time2_idx ON stop_times_joined (arrival_time2);

CREATE INDEX stop_times_joined_departure_time1_idx ON stop_times_joined (departure_time1);

-- No distinct because some trips go to the same stop twice