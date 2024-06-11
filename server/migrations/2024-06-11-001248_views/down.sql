-- This file should undo anything in `up.sql`
DROP MATERIALIZED VIEW IF EXISTS stop_route_details;

DROP INDEX IF EXISTS idx_stop_route_details_stop_id;

DROP INDEX IF EXISTS idx_stop_route_details_route_id;