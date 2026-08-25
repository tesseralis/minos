use std::{env::args, fs, str::FromStr};

use itertools::Itertools;
use mino::{enumerate::generate_children, mino::Polyomino};

fn main() {
    let args = args().collect_vec();
    let mut minos = vec![];
    // Read from stdin (pass in a file with <)
    let file = fs::read_to_string(&args[1]).expect("File not found");
    for line in file.lines() {
        let Ok(mino) = Polyomino::from_str(&line);
        minos.push(mino);
    }

    for child in generate_children(&minos) {
        println!("{}", child.to_string());
    }
}
