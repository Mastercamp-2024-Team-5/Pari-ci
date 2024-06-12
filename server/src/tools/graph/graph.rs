use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashMap};

#[derive(Debug, Clone)]
pub struct Edge {
    pub destination: usize,
    pub weight: u32,
}

#[allow(dead_code)]
#[derive(Debug, Clone)]
pub struct Node {
    pub id: usize,
    pub edges: Vec<Edge>,
}

#[derive(Debug)]
pub struct Graph {
    pub nodes: Vec<Node>,
    pub node_indices: HashMap<usize, usize>, // Use usize as key
}

impl Graph {
    pub fn new() -> Self {
        Self {
            nodes: Vec::new(),
            node_indices: HashMap::new(),
        }
    }

    pub fn add_node(&mut self, id: usize) {
        let index = self.nodes.len();
        self.nodes.push(Node {
            id,
            edges: Vec::new(),
        });
        self.node_indices.insert(id, index);
    }

    pub fn add_edge(&mut self, from: usize, to: usize, weight: u32) {
        let from_index = self.node_indices[&from];
        let to_index = self.node_indices[&to];
        self.nodes[from_index].edges.push(Edge {
            destination: to_index,
            weight,
        });
    }

    pub fn shortest_path(&self, start: usize, goal: usize) -> Option<(u32, Vec<usize>)> {
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
                    path.push(self.nodes[current].id);
                    current = prev;
                }
                path.push(self.nodes[start_index].id);
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
