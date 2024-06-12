-- This file should undo anything in `up.sql`
DROP MATERIALIZED VIEW IF EXISTS average_stop_times;

DROP INDEX IF EXISTS idx_average_stop_times_stop_id;

DROP INDEX IF EXISTS idx_average_stop_times_next_stop_id;