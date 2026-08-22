use std::collections::BTreeSet;

use crate::point::{Point, DOWN, RIGHT};
use itertools::Itertools;

type MinoData = BTreeSet<Point>;

#[derive(PartialEq, Eq, Hash, Clone)]
pub struct Polyomino {
    pub data: MinoData,
}

impl Polyomino {
    pub fn size(&self) -> usize {
        self.data.len()
    }
    pub fn width(&self) -> i16 {
        self.data.iter().map(|p| p.x).max().unwrap() + 1
    }
    pub fn height(&self) -> i16 {
        self.data.iter().map(|p| p.y).min().unwrap() + 1
    }
    pub fn neighbors(&self) -> impl Iterator<Item = Point> + '_ {
        self.data
            .clone()
            .into_iter()
            .flat_map(|p| p.neighbors())
            .filter(|p| !self.data.contains(p))
            .unique()
    }

    pub fn children(&self) -> impl Iterator<Item = Polyomino> + '_ {
        self.neighbors().map(|p| Polyomino {
            data: add_square(&self.data, p),
        })
    }
}

fn add_square(data: &MinoData, p: Point) -> MinoData {
    if p.x < 0 {
        let mut mapped: MinoData = data.iter().map(|p| *p + RIGHT).collect();
        mapped.insert(Point::new(0, p.y));
        mapped
    } else if p.y < 0 {
        let mut mapped: MinoData = data.iter().map(|p| *p + DOWN).collect();
        mapped.insert(Point::new(p.x, 0));
        mapped
    } else {
        let mut mapped: MinoData = data.clone();
        mapped.insert(p);
        mapped
    }
}
