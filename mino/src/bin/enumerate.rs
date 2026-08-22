use itertools::Itertools;
use mino::mino::Polyomino;
use mino::point::Point;
use std::collections::BTreeSet;

fn generate_graph(n: usize) -> Vec<Vec<Polyomino>> {
    let monomino: Polyomino = Polyomino {
        data: BTreeSet::from([Point::new(0, 0)]),
    };

    let mut nodes = vec![];

    let mut current_gen = vec![monomino];

    while nodes.len() < n - 1 {
        let next_gen: Vec<Polyomino> = current_gen
            .iter()
            .flat_map(|mino| mino.children())
            .unique()
            .collect_vec();
        nodes.push(current_gen);
        current_gen = next_gen;
    }
    nodes.push(current_gen);
    nodes
}

fn main() {
    // let monomino: Polyomino = Polyomino {
    //     data: BTreeSet::from([Point::new(0, 0)]),
    // };
    // let children = monomino.children().collect_vec();
    let nodes = generate_graph(10);
    for gen in nodes {
        println!("found {} minos", gen.len());
    }
}
