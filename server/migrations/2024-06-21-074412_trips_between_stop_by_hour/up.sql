-- Your SQL goes here
CREATE VIEW
    trips_between_stops_per_hour AS
WITH
    hour_slices AS (
        SELECT
            generate_series (0, 29) AS hour
    ),
    stop_pairs AS (
        SELECT DISTINCT
            stj.stop_id1 AS stop_id1,
            stj.stop_id2 AS stop_id2
        FROM
            stop_times_joined stj
    ),
    trips_in_hour AS (
        SELECT
            stj.stop_id1,
            stj.stop_id2,
            stj.trip_id,
            stj.departure_time1,
            stj.arrival_time2,
            hs.hour
        FROM
            stop_times_joined stj
            JOIN hour_slices hs ON (
                stj.departure_time1 >= hs.hour * 3600
                AND stj.departure_time1 < (hs.hour + 1) * 3600
                AND stj.arrival_time2 >= hs.hour * 3600
                AND stj.arrival_time2 < (hs.hour + 1) * 3600
            )
    ),
    distinct_pairs_in_hour AS (
        SELECT DISTINCT
            tih.stop_id1,
            tih.stop_id2,
            tih.hour
        FROM
            trips_in_hour tih
    )
SELECT
    sp.stop_id1,
    sp.stop_id2,
    hs.hour,
    CASE
        WHEN dpih.stop_id1 IS NOT NULL THEN 1
        ELSE 0
    END AS trip_exists
FROM
    stop_pairs sp
    CROSS JOIN hour_slices hs
    LEFT JOIN distinct_pairs_in_hour dpih ON sp.stop_id1 = dpih.stop_id1
    AND sp.stop_id2 = dpih.stop_id2
    AND hs.hour = dpih.hour
ORDER BY
    sp.stop_id1,
    sp.stop_id2,
    hs.hour;