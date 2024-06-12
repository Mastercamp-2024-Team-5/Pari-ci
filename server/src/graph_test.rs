use tools::graph::Graph;
use views::services::{
    get_average_times, get_average_transfert_times, get_first_child_stop, remove_trailing_stops,
};
pub mod models;
pub mod schema;
mod services;
pub mod tools;
pub mod views;
use std::time;
// Main function for debugging purposes

fn main() {
    // Example usage:
    let mut average_stop_times = get_average_times();
    average_stop_times.append(&mut get_average_transfert_times());
    println!("{:?}", average_stop_times.len());

    let graph = Graph::generate_graph(average_stop_times);

    let t1 = time::Instant::now();
    let starts = get_first_child_stop("IDFM:70143");
    // let ends = get_first_child_stop("IDFM:61727"); bois le roi
    // let ends = get_first_child_stop("IDFM:71591"); // Porte dorée (Tram 3a)
    let ends = get_first_child_stop("IDFM:70604"); // Porte de Choisy (Tram 3a)

    println!("{:?}", starts);
    println!("{:?}", ends);

    let shortest_path = graph.shortest_path(starts, ends);

    let shortest_path = match shortest_path {
        Some((cost, path)) => {
            let path: Vec<String> = path.iter().map(|x| x.clone()).collect();
            (cost, path)
        }
        None => (0, vec![]),
    };
    let shortest_path = (shortest_path.0, remove_trailing_stops(shortest_path.1));

    println!("{:?}", shortest_path);
    println!("{:?}", t1.elapsed());
}
