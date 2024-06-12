use std::collections::{HashSet};
use crate::views::models::AverageStopTime;

// Struct to represent a vertex (a stop)
#[derive(Debug, Clone, Eq, PartialEq, Hash)]
pub struct Vertex {
    stop_id: String,
}

// Struct to represent an edge (connection between two stops)
#[derive(Debug, Clone)]
pub struct Edge {
    start: Vertex,
    end: Vertex,
    average_travel_time: i64,
}

// Struct to represent the graph
#[derive(Debug, Clone)]
pub struct Graph {
    pub vertices: HashSet<Vertex>,
    pub edges: Vec<Edge>,
}

impl Graph {
    // Function to add a vertex to the graph
    pub fn add_vertex(&mut self, vertex: Vertex) {
        self.vertices.insert(vertex);
    }

    // Function to add an edge to the graph
    pub fn add_edge(&mut self, edge: Edge) {
        self.edges.push(edge.clone());
        self.vertices.insert(edge.start.clone());
        self.vertices.insert(edge.end.clone());
    }
}

// Function to create a graph from a vector of TravelTime
pub fn create_graph(average_stop_times: Vec<AverageStopTime>) -> Graph {
    let mut graph = Graph {
        vertices: HashSet::new(),
        edges: Vec::new(),
    };
    for i in average_stop_times {
        let start = Vertex {
            stop_id: i.stop_id.clone(),
        };
        let end = Vertex {
            stop_id: i.next_stop_id.clone(),
        };
        let edge = Edge {
            start: start.clone(),
            end: end.clone(),
            average_travel_time: i.avg_travel_time as i64,
        };
        graph.add_edge(edge);
        graph.add_vertex(start);
        graph.add_vertex(end);
    }
    graph
}

