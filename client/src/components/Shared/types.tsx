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