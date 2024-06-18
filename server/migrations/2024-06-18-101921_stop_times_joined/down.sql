-- This file should undo anything in `up.sql`
DROP MATERIALIZED VIEW IF EXISTS stop_times_joined;

DROP INDEX IF EXISTS stop_times_joined_idx;