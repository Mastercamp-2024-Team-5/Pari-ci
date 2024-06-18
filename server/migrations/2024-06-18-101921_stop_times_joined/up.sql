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
    OR t1.stop_sequence = t2.stop_sequence + 1;

CREATE UNIQUE INDEX stop_times_joined_idx ON stop_times_joined (trip_id, stop_id1, stop_id2);