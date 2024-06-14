use serde::{Deserialize, Serialize};
use tools::graph::Graph;

pub mod models;
pub mod schema;
mod services;
pub mod tools;
pub mod views;
use diesel::prelude::*;
// Main function for debugging purposes

#[derive(Debug, Serialize, Deserialize)]
struct StopRouteDetails {
    stop: String,
    children: Vec<String>,
}

fn main() {
    let route_id = "IDFM:C01379";

    use views::schema::average_stop_times::dsl as avg_st;
    let connection = &mut services::establish_connection_pg();
    let results = avg_st::average_stop_times
        .inner_join(
            views::schema::stop_route_details::table
                .on(avg_st::stop_id.eq(views::schema::stop_route_details::stop_id)),
        )
        .filter(views::schema::stop_route_details::route_id.eq(route_id))
        .select(avg_st::average_stop_times::all_columns())
        .load::<views::models::AverageStopTime>(connection)
        .expect("Error loading stops");

    for result in &results {
        let stop_name = views::schema::stop_route_details::table
            .filter(views::schema::stop_route_details::stop_id.eq(&result.stop_id))
            .select(views::schema::stop_route_details::stop_name)
            .first::<String>(connection)
            .expect("Error loading stops");
        let next_stop_name = views::schema::stop_route_details::table
            .filter(views::schema::stop_route_details::stop_id.eq(&result.next_stop_id))
            .select(views::schema::stop_route_details::stop_name)
            .first::<String>(connection)
            .expect("Error loading stops");
        println!(
            "{:?} -> {:?} : {:?} {:?}",
            stop_name,
            next_stop_name,
            result.avg_travel_time,
            (&result.stop_id, &result.next_stop_id)
        );
    }

    let mygraph = Graph::generate_graph(results);
    mygraph.draw("graph.dot", "graph.png");
    let mut graphs = mygraph.get_subgraphs();
    let mut i = 0;
    for graph in graphs.iter_mut() {
        *graph = graph.into_tree().unwrap();
        graph.draw(
            format!("graph{}.dot", i).as_str(),
            format!("graph{}.png", i).as_str(),
        );
        i += 1;
    }

    let mut stop_route_details = Vec::<Vec<StopRouteDetails>>::new();
    for graph in graphs {
        let mut vec = Vec::new();
        for node in graph.nodes.iter() {
            let children = node
                .edges
                .iter()
                .map(|x| graph.nodes[x.destination].id.clone())
                .collect::<Vec<String>>();
            vec.push(StopRouteDetails {
                stop: node.id.clone(),
                children: children,
            });
        }
        stop_route_details.push(vec);
    }

    for graph in stop_route_details {
        for node in graph {
            println!("{:?}", node);
        }
        println!("-----------------");
    }
}
