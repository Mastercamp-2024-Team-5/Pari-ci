
mod graph;
use crate::graph::Graph;

// Main function for debugging purposes

fn main() {
    // Create a new graph
    let mut graph = Graph::new();

    // Add some nodes
    graph.add_node(1, "Node A", false, 1, vec![1, 2]);
    graph.add_node(2, "Node B", true, 0, vec![2]);
    graph.add_node(3, "Node C", false, 2, vec![1]);

    // Add edges
    graph.add_edge("Node A", "Node B", 5);
    graph.add_edge("Node B", "Node C", 3);
    graph.add_edge("Node A", "Node C", 10);

    // Find the shortest path
    let start = "Node A";
    let goal = "Node C";
    if let Some((cost, path)) = graph.shortest_path(start, goal) {
        println!("Shortest path from {} to {}:", start, goal);
        for station in path {
            println!("  {}", station);
        }
        println!("Total cost: {}", cost);
    } else {
        println!("No path found from {} to {}.", start, goal);
    }
}
