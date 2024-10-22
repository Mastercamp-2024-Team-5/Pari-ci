export interface Hit {
  id: string;
  route_ids: string;
  route_short_names: string;
  stop_id: string;
  stop_name: string;
}

export interface Data {
  estimatedTotalHits: number;
  hits: Hit[];
  limit: number;
  offset: number;
  processingTimeMs: number;
  query: string;
}

export interface Trip {
  from_stop_id: string;
  to_stop_id: string;
  route_id: string;
  route_short_name: string;
  wait_time: number;
  travel_time: number;
  trip_id: string;
}

export interface SharedTripResponse {
  departure: InputStop;
  destination: InputStop;
  start_date?: string | null;
  end_date?: string | null;
  content: [string, Trip[]]
}

export type TripData = [string, Trip[]];

export interface Point {
  from: string;
  to: string;
  line: string | null;
  direction: string | null;
  nbr: number;
  travel_time: number;
  departure_time: number;
}

export interface TripInfo {
  departure: Date;
  points: Point[];
  arrival: Date;
}

export interface Stop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  location_type: number;
  parent_station: string;
  wheelchair_boarding: number;
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_type: number;
  color?: string;
}

export interface RouteTrace {
  id: string;
  route_id: string;
  shape: string;
  route_type: number;
  color: string;
}

export interface Route {
  route_id: string,
  agency_id: string,
  short_name: string,
  long_name: string,
  description?: string,
  route_type: number,
  url?: string,
  color: string,
  text_color?: string,
  sort_order?: number
}

export interface RouteCollection {
  collection: GeoJSON.FeatureCollection
  route_id: string
  route_color: string
}

export enum ActiveSearchInput {
  Departure = "Departure",
  Destination = "Destination",
}

export interface InputStop {
  name: string;
  id: string;
}