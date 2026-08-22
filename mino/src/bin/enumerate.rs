use itertools::Itertools;
use mino::mino::Polyomino;
use mino::point::Point;
use rustc_hash::FxBuildHasher;

fn generate_graph(n: usize) -> Vec<Vec<Polyomino>> {
    let monomino: Polyomino = Polyomino::new(vec![Point::new(0, 0)]);

    let mut nodes = Vec::with_capacity(n);

    let mut current_gen = vec![monomino];

    while nodes.len() < n - 1 {
        let next_gen = current_gen
            .iter()
            .flat_map(|mino| mino.free_children())
            .unique_with_hasher(FxBuildHasher)
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

    let nodes = generate_graph(12);
    for gen in nodes {
        println!("found {} minos", gen.len());
    }
}
