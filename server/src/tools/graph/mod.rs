use crate::views::models::AverageStopTime;
use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashMap};

type NodeIndex = String;

#[derive(Debug, Clone)]
pub struct Edge {
    pub destination: usize,
    pub weight: u32,
}

#[allow(dead_code)]
#[derive(Debug, Clone)]
pub struct Node {
    pub id: NodeIndex,
    pub edges: Vec<Edge>,
}

impl PartialEq for Node {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

#[derive(Debug)]
pub struct Graph {
    pub nodes: Vec<Node>,
    pub node_indices: HashMap<NodeIndex, usize>,
}

impl Graph {
    pub fn new() -> Self {
        Self {
            nodes: Vec::new(),
            node_indices: HashMap::new(),
        }
    }

    pub fn add_node(&mut self, id: NodeIndex) {
        if self.node_indices.contains_key(&id) {
            return;
        }
        let index = self.nodes.len();
        self.nodes.push(Node {
            id: id.clone(),
            edges: Vec::new(),
        });
        self.node_indices.insert(id, index);
    }

    pub fn add_edge(&mut self, from: NodeIndex, to: NodeIndex, weight: u32) {
        let from_index = self.node_indices[&from];
        let to_index = self.node_indices[&to];
        self.nodes[from_index].edges.push(Edge {
            destination: to_index,
            weight,
        });
    }

    pub fn shortest_path(
        &self,
        start: NodeIndex,
        goal: NodeIndex,
    ) -> Option<(u32, Vec<NodeIndex>)> {
        let start_index = *self.node_indices.get(&start)?;
        let goal_index = *self.node_indices.get(&goal)?;

        let mut distances = vec![u32::MAX; self.nodes.len()];
        let mut previous_nodes = vec![None; self.nodes.len()];
        distances[start_index] = 0;

        let mut heap = BinaryHeap::new();
        heap.push(State {
            cost: 0,
            position: start_index,
        });

        while let Some(State { cost, position }) = heap.pop() {
            if position == goal_index {
                let mut path = Vec::new();
                let mut current = goal_index;
                while let Some(prev) = previous_nodes[current] {
                    path.push(self.nodes[current].id.clone());
                    current = prev;
                }
                path.push(self.nodes[start_index].id.clone());
                path.reverse();
                return Some((cost, path));
            }

            if cost > distances[position] {
                continue;
            }

            for edge in &self.nodes[position].edges {
                let next = State {
                    cost: cost + edge.weight,
                    position: edge.destination,
                };

                if next.cost < distances[next.position] {
                    heap.push(next);
                    distances[next.position] = next.cost;
                    previous_nodes[next.position] = Some(position);
                }
            }
        }
        None
    }

    pub fn generate_graph(average_stop_times: Vec<AverageStopTime>) -> Self {
        let mut graph = Graph::new();
        for i in average_stop_times.iter() {
            graph.add_node(i.stop_id.clone());
            graph.add_node(i.next_stop_id.clone());
        }
        for i in average_stop_times {
            graph.add_edge(
                i.stop_id.clone(),
                i.next_stop_id.clone(),
                i.avg_travel_time as u32,
            );
        }
        graph
    }

    pub fn get_subgraphs(&self) -> Vec<Graph> {
        let mut visited = vec![false; self.nodes.len()];
        let mut subgraphs = Vec::new();

        for (index, _) in self.nodes.iter().enumerate() {
            if !visited[index] {
                // Perform a depth-first search (DFS) to find all nodes in this subgraph
                let mut stack = vec![index];
                let mut nodes_in_subgraph = Vec::new();

                while let Some(current_index) = stack.pop() {
                    if visited[current_index] {
                        continue;
                    }
                    visited[current_index] = true;
                    nodes_in_subgraph.push(current_index);

                    for edge in &self.nodes[current_index].edges {
                        let neighbor_index = edge.destination;
                        if !visited[neighbor_index] {
                            stack.push(neighbor_index);
                        }
                    }
                }

                // Create a new subgraph containing only the nodes and edges of this component
                let mut new_graph = Graph::new();
                for &node_index in &nodes_in_subgraph {
                    let node = &self.nodes[node_index];
                    new_graph.add_node(node.id.clone());
                    for edge in &node.edges {
                        new_graph.add_node(self.nodes[edge.destination].id.clone());
                        new_graph.add_edge(
                            node.id.clone(),
                            self.nodes[edge.destination].id.clone(),
                            edge.weight,
                        );
                    }
                }

                subgraphs.push(new_graph);
            }
        }
        subgraphs
    }

    pub fn to_vec(&self) -> Vec<String> {
        // return a vector of the node ids in order of traversal
        // if more than one edge is present, the function panics
        let mut result = Vec::new();
        let mut visited = vec![false; self.nodes.len()];
        let mut stack = Vec::new();
        stack.push(0);
        while let Some(node_index) = stack.pop() {
            if visited[node_index] {
                continue;
            }
            visited[node_index] = true;
            let node = &self.nodes[node_index];
            result.push(node.id.clone());
            for edge in &node.edges {
                if visited[edge.destination] {
                    continue;
                }
                stack.push(edge.destination);
            }
        }
        result
    }
}

#[derive(Copy, Clone, Eq, PartialEq)]
struct State {
    cost: u32,
    position: usize,
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.cmp(&self.cost)
    }
}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}
