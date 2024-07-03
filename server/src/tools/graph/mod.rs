use crate::views::models::AverageStopTimeWithWait;
use petgraph::dot::{Config, Dot};
use petgraph::graph::DiGraph;
use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashMap, HashSet};
use std::process::Command;

type NodeIndex = String;

#[derive(Debug, Clone)]
pub struct Edge {
    pub destination: usize,
    pub route: String,
    pub weight: u32,
    pub wait_time: u32,
    pub trip_per_hour: Option<[i32; 30]>,
    pub pmr_access: bool,
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

    pub fn add_edge(
        &mut self,
        from: NodeIndex,
        to: NodeIndex,
        weight: u32,
        wait_time: u32,
        route: String,
        trip_per_hour: Option<[i32; 30]>,
        pmr_access: bool,
    ) {
        let from_index = self.node_indices[&from];
        let to_index = self.node_indices[&to];
        self.nodes[from_index].edges.push(Edge {
            destination: to_index,
            route,
            weight,
            wait_time,
            trip_per_hour,
            pmr_access,
        });
    }

    pub fn shortest_path(
        &self,
        start: NodeIndex,
        goal: NodeIndex,
        hour: usize,
        reverse: bool,
        pmr: bool,
        forbiden_edges: Vec<(NodeIndex, NodeIndex)>,
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
            prev_route: None,
        });

        while let Some(State {
            cost,
            position,
            prev_route,
        }) = heap.pop()
        {
            if position == goal_index {
                let mut path = Vec::new();
                let mut current = goal_index;
                while let Some(prev) = previous_nodes[current] {
                    path.push(self.nodes[current].id.clone());
                    current = prev;
                }
                path.push(self.nodes[start_index].id.clone());
                path.reverse();
                println!("{:?},{:?}", cost, path);
                return Some((cost, path));
            }

            if cost > distances[position] {
                continue;
            }

            for edge in &self.nodes[position].edges {
                // check if the edge is forbidden
                if forbiden_edges.contains(&(
                    self.nodes[position].id.clone(),
                    self.nodes[edge.destination].id.clone(),
                )) {
                    continue;
                }
                // check if we are using a parent transfer for fast traveling
                if (edge.wait_time == 0 && edge.weight == 0)
                    && (edge.destination != goal_index && position != start_index)
                {
                    continue;
                }
                // check if the edge is pmr compatible
                if pmr && !edge.pmr_access {
                    continue;
                }
                // check if there is a trip between the two stops at the current hour
                let hour_offset = if let Some(mut trip_per_hour) = &edge.trip_per_hour {
                    let current_hour = if reverse {
                        hour as i32 - (cost / 3600) as i32
                    } else {
                        hour as i32 + (cost / 3600) as i32
                    };
                    let current_hour = current_hour.rem_euclid(30);
                    // find the number of hours until the next trip
                    let slice = trip_per_hour.as_mut_slice();
                    slice.rotate_left(current_hour as usize);
                    let position = if reverse {
                        slice.iter().rev().position(|&x| x > 0)
                    } else {
                        slice.iter().position(|&x| x > 0)
                    };
                    match position {
                        Some(next_hour) => Some(next_hour as u32 * 3600),
                        None => None,
                    }
                } else {
                    Some(0)
                };
                if hour_offset.is_none() {
                    continue;
                }
                let next = State {
                    cost: if prev_route == Some(edge.route.clone()) {
                        cost + edge.weight + hour_offset.unwrap()
                    } else {
                        cost + edge.weight + edge.wait_time + 180 + hour_offset.unwrap()
                        // add 3 minutes for augmenting the cost of changing routes
                    },
                    prev_route: Some(edge.route.clone()),
                    position: edge.destination,
                };

                if next.cost < distances[next.position] {
                    heap.push(next.clone());
                    distances[next.position] = next.cost;
                    previous_nodes[next.position] = Some(position);
                }
            }
        }
        None
    }

    pub fn generate_graph(average_stop_times: Vec<AverageStopTimeWithWait>) -> Self {
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
                i.avg_wait_time as u32,
                i.route_id.clone(),
                i.trip_per_hour,
                i.pmr_compatible,
            );
        }
        graph
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
                        subgraph.add_edge(
                            from_id.clone(),
                            to_id,
                            edge.weight,
                            edge.wait_time,
                            edge.route.clone(),
                            edge.trip_per_hour.clone(),
                            edge.pmr_access,
                        );
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
                    edge.weight + edge.wait_time,
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
            tree.add_edge(start.clone(), node, 0, 0, "start".to_string(), None, true);
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

    pub fn get_root(&self) -> Option<Vec<NodeIndex>> {
        // return the node with no predecessors
        let roots = self
            .nodes
            .iter()
            .filter(|node| {
                !self.nodes.iter().any(|other_node| {
                    other_node
                        .edges
                        .iter()
                        .any(|edge| edge.destination == self.node_indices[&node.id])
                })
            })
            .map(|node| node.id.clone())
            .collect::<Vec<NodeIndex>>();
        if roots.len() >= 1 {
            Some(roots)
        } else {
            None
        }
    }

    pub fn get_children(&self, node: &NodeIndex) -> Vec<NodeIndex> {
        // return the children of a node
        self.nodes[self.node_indices[node]]
            .edges
            .iter()
            .map(|edge| self.nodes[edge.destination].id.clone())
            .collect()
    }
}

#[derive(Clone, Eq, PartialEq)]
struct State {
    cost: u32,
    position: usize,
    prev_route: Option<String>,
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
