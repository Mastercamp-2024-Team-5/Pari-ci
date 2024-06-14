use crate::views::models::AverageStopTime;
use petgraph::dot::{Config, Dot};
use petgraph::graph::DiGraph;
use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashMap, HashSet};
use std::process::Command;

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

#[derive(Debug, Clone)]
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

    pub fn old_get_subgraphs(&self) -> Vec<Graph> {
        let mut subgraphs = Vec::new();
        let mut visited = HashSet::new();

        for node in &self.nodes {
            if !visited.contains(&node.id) {
                let mut subgraph_nodes = Vec::new();
                let mut stack = vec![node.id.clone()];

                while let Some(current_id) = stack.pop() {
                    if visited.contains(&current_id) {
                        continue;
                    }

                    visited.insert(current_id.clone());

                    let current_index = self.node_indices[&current_id];
                    let current_node = &self.nodes[current_index];

                    subgraph_nodes.push(current_node.clone());

                    for edge in &current_node.edges {
                        let neighbor_id = &self.nodes[edge.destination].id;
                        if !visited.contains(neighbor_id) {
                            stack.push(neighbor_id.clone());
                        }
                    }
                }

                let mut subgraph = Graph::new();
                for node in subgraph_nodes.iter() {
                    subgraph.add_node(node.id.clone());
                }
                for node in subgraph_nodes {
                    let from_id = node.id.clone();
                    for edge in node.edges {
                        let to_id = self.nodes[edge.destination].id.clone();
                        subgraph.add_node(to_id.clone());
                        subgraph.add_edge(from_id.clone(), to_id, edge.weight);
                    }
                }
                subgraphs.push(subgraph);
            }
        }
        subgraphs
    }

    pub fn get_subgraphs(&self) -> Vec<Graph> {
        let mut subgraphs = Vec::new();
        let mut visited = HashSet::new();

        // Create a map from node id to its neighbors
        let mut neighbors = HashMap::new();
        for node in &self.nodes {
            for edge in &node.edges {
                neighbors
                    .entry(node.id.clone())
                    .or_insert_with(HashSet::new)
                    .insert(self.nodes[edge.destination].id.clone());
                neighbors
                    .entry(self.nodes[edge.destination].id.clone())
                    .or_insert_with(HashSet::new)
                    .insert(node.id.clone());
            }
        }
        println!("{:?}", neighbors.len());
        println!("{:?}", self.nodes.len());

        for node in &self.nodes {
            if !visited.contains(&node.id) {
                let mut subgraph_nodes = Vec::new();
                let mut stack = vec![node.id.clone()];

                while let Some(current_id) = stack.pop() {
                    if visited.contains(&current_id) {
                        continue;
                    }

                    visited.insert(current_id.clone());

                    let current_index = self.node_indices[&current_id];
                    let current_node = &self.nodes[current_index];

                    subgraph_nodes.push(current_node.clone());

                    // Use the neighbors map instead of the edges list
                    if let Some(neighbors_of_current) = neighbors.get(&current_id) {
                        for neighbor_id in neighbors_of_current {
                            if !visited.contains(neighbor_id) {
                                stack.push(neighbor_id.clone());
                            }
                        }
                    }
                }

                let mut subgraph = Graph::new();
                for node in subgraph_nodes.iter() {
                    subgraph.add_node(node.id.clone());
                }
                for node in subgraph_nodes {
                    let from_id = node.id.clone();
                    for edge in node.edges {
                        let to_id = self.nodes[edge.destination].id.clone();
                        subgraph.add_node(to_id.clone());
                        subgraph.add_edge(from_id.clone(), to_id, edge.weight);
                    }
                }
                subgraphs.push(subgraph);
            }
        }
        println!("{:?}", visited.len());
        println!(
            "{:?}",
            subgraphs
                .iter()
                .map(|x| x.nodes.len())
                .collect::<Vec<usize>>()
                .iter()
                .sum::<usize>()
        );
        subgraphs
    }

    pub fn draw(&self, dot_file_path: &str, image_file_path: &str) {
        let mut graph = DiGraph::new();
        let mut pet_node_indices = Vec::new();

        // Add nodes
        for node in &self.nodes {
            let idx = graph.add_node(node.id.clone());
            pet_node_indices.push(idx);
        }

        // Add edges
        for (i, node) in self.nodes.iter().enumerate() {
            for edge in &node.edges {
                graph.add_edge(
                    pet_node_indices[i],
                    pet_node_indices[edge.destination],
                    edge.weight,
                );
            }
        }

        // Generate dot representation
        let dot = Dot::with_config(&graph, &[Config::EdgeNoLabel]);

        // Write to file
        std::fs::write(dot_file_path, format!("{:?}", dot)).unwrap();

        let output = Command::new("dot")
            .arg("-Tpng")
            .arg(dot_file_path)
            .arg("-o")
            .arg(image_file_path)
            .output()
            .expect("Failed to execute dot command");

        if !output.status.success() {
            eprintln!(
                "dot command failed with stderr:\n{}",
                String::from_utf8_lossy(&output.stderr)
            );
        }
    }

    pub fn unoriented_dfs(&self, start: Option<NodeIndex>) -> impl Iterator<Item = NodeIndex> + '_ {
        // return an iterator that traverses the graph in a depth-first manner
        // the depth-first search is unoriented
        // if start is None, the function takes the first node as the starting point
        let start = start.unwrap_or_else(|| self.nodes[0].id.clone());
        let mut neighbors = HashMap::new();
        for node in &self.nodes {
            for edge in &node.edges {
                neighbors
                    .entry(node.id.clone())
                    .or_insert_with(HashSet::new)
                    .insert(self.nodes[edge.destination].id.clone());
                neighbors
                    .entry(self.nodes[edge.destination].id.clone())
                    .or_insert_with(HashSet::new)
                    .insert(node.id.clone());
            }
        }
        let mut visited = HashSet::new();
        let mut stack = vec![start.clone()];
        std::iter::from_fn(move || {
            while let Some(current_id) = stack.pop() {
                if visited.contains(&current_id) {
                    continue;
                }
                visited.insert(current_id.clone());
                // Use the neighbors map instead of the edges list
                if let Some(neighbors_of_current) = neighbors.get(&current_id) {
                    for neighbor_id in neighbors_of_current {
                        if !visited.contains(neighbor_id) {
                            stack.push(neighbor_id.clone());
                        }
                    }
                }
                return Some(current_id);
            }
            None
        })
    }

    pub fn dfs(&self, start: Option<NodeIndex>) -> impl Iterator<Item = NodeIndex> + '_ {
        // return an iterator that traverses the graph in a depth-first manner
        // if start is None, the function takes the first node as the starting point
        let start = start.unwrap_or_else(|| self.nodes[0].id.clone());
        let mut visited = HashSet::new();
        let mut stack = vec![start.clone()];
        std::iter::from_fn(move || {
            while let Some(current_id) = stack.pop() {
                if visited.contains(&current_id) {
                    continue;
                }
                visited.insert(current_id.clone());
                let current_index = self.node_indices[&current_id];
                let current_node = &self.nodes[current_index];
                stack.extend(
                    current_node
                        .edges
                        .iter()
                        .map(|edge| self.nodes[edge.destination].id.clone())
                        .filter(|neighbor_id| !visited.contains(neighbor_id)),
                );
                return Some(current_id);
            }
            None
        })
    }

    pub fn into_tree(&self) -> Result<Graph, &str> {
        // remove all loops from the graph by removing the edge which link nodes with a rank difference of more than 1
        // loops of unoriented edges are taken into account
        let mut tree = self.clone();
        let mut neighbors = HashMap::new();
        for node in &tree.nodes {
            for edge in &node.edges {
                neighbors
                    .entry(node.id.clone())
                    .or_insert_with(HashSet::new)
                    .insert(tree.nodes[edge.destination].id.clone());
                neighbors
                    .entry(tree.nodes[edge.destination].id.clone())
                    .or_insert_with(HashSet::new)
                    .insert(node.id.clone());
            }
        }

        // start the rank computation from a node with no predecessors
        let starts = tree
            .nodes
            .iter()
            .filter(|node| {
                !tree.nodes.iter().any(|other_node| {
                    other_node
                        .edges
                        .iter()
                        .any(|edge| edge.destination == tree.node_indices[&node.id])
                })
            })
            .map(|node| node.id.clone())
            .collect::<Vec<NodeIndex>>();

        if starts.is_empty() {
            // check if we have a node which if we start from it, we can reach all the other nodes
            return Err("The graph has loops");
        }

        // add a start node that links to all the nodes with no predecessors
        let start = "start".to_string();
        tree.add_node(start.clone());
        for node in starts {
            tree.add_edge(start.clone(), node, 0);
        }

        let mut stack = vec![start.clone()];
        let mut visited: HashSet<NodeIndex> = HashSet::new();
        let mut ranks = HashMap::new();
        ranks.insert(start.clone(), 0);
        // compute the rank of each node
        while let Some(current_id) = stack.pop() {
            let current_rank = ranks[&current_id];
            let current_index = tree.node_indices[&current_id];
            let current_node = &tree.nodes[current_index];
            for edge in &current_node.edges {
                let neighbor_id = &tree.nodes[edge.destination].id;
                if !ranks.contains_key(neighbor_id) {
                    ranks.insert(neighbor_id.clone(), current_rank + 1);
                    stack.push(neighbor_id.clone());
                } else if ranks[neighbor_id] < current_rank + 1 {
                    ranks.insert(neighbor_id.clone(), current_rank + 1);
                    stack.push(neighbor_id.clone());
                }
            }
            visited.insert(current_id);
        }

        //remove the edges that link nodes with a rank difference of more than 1
        for node in tree.nodes.iter_mut() {
            let mut new_edges = Vec::new();
            for edge in &node.edges {
                // only keep the edges that link nodes with a rank difference of 1 or when there is only one edge (else it will disconnect the graph)
                if (ranks[&node.id] as i32 - ranks[&self.nodes[edge.destination].id] as i32).abs()
                    == 1
                    || node.edges.len() == 1
                {
                    new_edges.push(edge.clone());
                }
            }
            node.edges = new_edges;
        }

        // remove the start node
        tree.nodes.remove(tree.node_indices[&start]);
        tree.node_indices.remove(&start);

        Ok(tree)
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
