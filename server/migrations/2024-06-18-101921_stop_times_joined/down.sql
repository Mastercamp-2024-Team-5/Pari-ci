-- This file should undo anything in `up.sql`
DROP MATERIALIZED VIEW IF EXISTS stop_times_joined;

DROP INDEX IF EXISTS stop_times_joined_idx;

DROP INDEX IF EXISTS stop_times_joined_stop_id1_idx;

DROP INDEX IF EXISTS stop_times_joined_stop_id2_idx;

DROP INDEX IF EXISTS stop_times_joined_trip_id_idx;