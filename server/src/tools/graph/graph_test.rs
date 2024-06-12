
mod graph;
use crate::graph::Graph;

// Main function for debugging purposes

fn main() {
    // Example usage:
    let mut graph = Graph::new();
    graph.add_node(1);
    graph.add_node(2);
    graph.add_edge(1, 2, 10);

    if let Some((cost, path)) = graph.shortest_path(1, 2) {
        println!("Cost: {}, Path: {:?}", cost, path);
    } else {
        println!("No path found");
    }
}