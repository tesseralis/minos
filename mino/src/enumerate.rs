use itertools::Itertools;
use rustc_hash::FxBuildHasher;

use crate::{mino::Polyomino, point::Point, transform::Transformable};

// TODO Ideally this would be an infinite iterator but I was having trouble getting the ownership to work
pub fn enumerate_minos(n: usize) -> Vec<Vec<Polyomino>> {
    let monomino: Polyomino = Polyomino::new(vec![Point::new(0, 0)]);

    let mut gens = Vec::with_capacity(n);

    let mut current_gen = vec![monomino];

    while gens.len() < n - 1 {
        let next_gen = current_gen
            .iter()
            .flat_map(|mino| mino.children())
            .unique_with_hasher(FxBuildHasher)
            .map(|child| child.free())
            .unique_with_hasher(FxBuildHasher)
            .collect();
        gens.push(current_gen);
        current_gen = next_gen;
    }
    gens.push(current_gen);
    gens
}
