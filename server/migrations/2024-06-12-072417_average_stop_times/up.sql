-- Your SQL goes here
CREATE MATERIALIZED VIEW average_stop_times AS
SELECT
    st1.stop_id,
    st2.stop_id AS next_stop_id,
    t.route_id,
    AVG(st2.arrival_time - st1.departure_time)::INT AS avg_travel_time,
    t.wheelchair_accessible
FROM
    stop_times as st1
    JOIN stop_times as st2 ON st1.trip_id = st2.trip_id
    JOIN trips as t ON st1.trip_id = t.trip_id
    AND st1.stop_sequence = st2.stop_sequence - 1
GROUP BY
    st1.stop_id,
    st2.stop_id,
    t.route_id,
    t.wheelchair_accessible
ORDER BY
    avg_travel_time;

CREATE INDEX idx_average_stop_times_stop_id ON average_stop_times (stop_id);

CREATE INDEX idx_average_stop_times_next_stop_id ON average_stop_times (next_stop_id);