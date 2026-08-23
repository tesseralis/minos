use std::env;

use itertools::Itertools;
use mino::classes::GetDirClass;
use mino::mino::Polyomino;
use mino::point::Point;
use mino::transform::Transformable;
use rustc_hash::FxBuildHasher;

fn generate_graph(n: usize) -> Vec<Vec<Polyomino>> {
    let monomino: Polyomino = Polyomino::new(vec![Point::new(0, 0)]);

    let mut nodes = Vec::with_capacity(n);

    let mut current_gen = vec![monomino];

    while nodes.len() < n - 1 {
        let next_gen = current_gen
            .iter()
            .flat_map(|mino| mino.children())
            .unique_with_hasher(FxBuildHasher)
            .map(|child| child.free())
            .unique_with_hasher(FxBuildHasher)
            .collect();
        nodes.push(current_gen);
        current_gen = next_gen;
    }
    nodes.push(current_gen);
    nodes
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let n: usize = args[1].parse().expect("Requires an integer");

    let nodes = generate_graph(n);
    for gen in nodes {
        // println!("{:?}", gen.len());
        println!("");
        let counts = gen.into_iter().counts_by(|mino| mino.get_dir_class());
        for (cls, count) in counts.iter() {
            println!("{:?}: {}", cls, count);
        }
    }
}
