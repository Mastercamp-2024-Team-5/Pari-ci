-- This file should undo anything in `up.sql`
DROP TABLE stop_times;

DROP INDEX IF EXISTS arrival_time_index;

DROP INDEX IF EXISTS departure_time_index;