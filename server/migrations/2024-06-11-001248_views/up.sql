-- Your SQL goes here
CREATE MATERIALIZED VIEW stop_route_details AS
SELECT DISTINCT
    ON (s.stop_id, r.route_id) s.stop_id,
    s.stop_name,
    s.stop_lat,
    s.stop_lon,
    s.location_type,
    s.parent_station,
    s.wheelchair_boarding,
    r.route_id,
    r.short_name AS route_short_name,
    r.long_name AS route_long_name,
    r.route_type
FROM
    stops s
    JOIN stop_times st ON s.stop_id = st.stop_id
    JOIN trips t ON st.trip_id = t.trip_id
    JOIN routes r ON t.route_id = r.route_id
ORDER BY
    s.stop_id,
    r.route_id;

CREATE INDEX idx_stop_route_details_stop_id ON stop_route_details (stop_id);

CREATE INDEX idx_stop_route_details_route_id ON stop_route_details (route_id);