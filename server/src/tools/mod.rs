pub mod graph;

pub fn haversine_distance(from_coord: (f64, f64), to_coord: (f64, f64)) -> f64 {
    let (lon1, lat1) = from_coord;
    let (lon2, lat2) = to_coord;
    let radius = 6371.0; // Earth radius in km
    let d_lat = (lat2 - lat1).to_radians();
    let d_lon = (lon2 - lon1).to_radians();
    let a = (d_lat / 2.0).sin() * (d_lat / 2.0).sin()
        + lat1.to_radians().cos()
            * lat2.to_radians().cos()
            * (d_lon / 2.0).sin()
            * (d_lon / 2.0).sin();
    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());
    // Return distance in km
    radius * c
}
