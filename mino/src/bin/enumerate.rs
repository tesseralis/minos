use itertools::Itertools;
use mino::mino::Polyomino;
use mino::point::Point;
use std::collections::BTreeSet;

fn generate_graph(n: usize) -> Vec<Vec<Polyomino>> {
    let monomino: Polyomino = Polyomino::new(BTreeSet::from([Point::new(0, 0)]));

    let mut nodes = vec![];

    let mut current_gen = vec![monomino];

    while nodes.len() < n - 1 {
        let next_gen = current_gen
            .iter()
            .flat_map(|mino| mino.free_children())
            .unique()
            .collect();
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
    // let domino: Polyomino = Polyomino {
    //     data: BTreeSet::from([Point::new(0, 0), Point::new(0, 1)]),
    // };
    // let children = domino.free_children().collect_vec();
    // println!("free: {:?}", children[1].free().data);
    // println!("free: {:?}", children[2].free().data);

    let nodes = generate_graph(11);
    for gen in nodes {
        println!("found {} minos", gen.len());
    }
}
