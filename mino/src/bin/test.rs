use itertools::Itertools;
use mino::{classes::GetDirClass, enumerate::enumerate_minos};
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    let n: usize = args[1].parse().expect("Requires an integer");

    let nodes = enumerate_minos(n);
    for gen in nodes {
        // println!("{:?}", gen.len());
        println!("");
        let counts = gen.into_iter().counts_by(|mino| mino.get_dir_class());
        for (cls, count) in counts.iter() {
            println!("{:?}: {}", cls, count);
        }
    }
}
