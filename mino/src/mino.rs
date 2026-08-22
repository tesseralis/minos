use std::{
    cmp::Ordering::{self, Equal, Greater, Less},
    collections::BTreeSet,
};

use crate::{
    point::{Point, DOWN, RIGHT},
    transform::Transformable,
};
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
        self.data.iter().map(|p| p.y).max().unwrap() + 1
    }

    pub fn has(&self, item: &Point) -> bool {
        self.data.contains(item)
    }

    pub fn neighbors(&self) -> impl Iterator<Item = Point> + '_ {
        self.data
            .iter()
            .flat_map(|p| p.neighbors())
            .filter(|p| !self.has(p))
            .unique()
    }

    pub fn children(&self) -> impl Iterator<Item = Polyomino> + '_ {
        self.neighbors().map(|p| Polyomino {
            data: add_square(&self.data, p),
        })
    }

    pub fn free_children(&self) -> impl Iterator<Item = Polyomino> + '_ {
        self.children().map(|child| child.free()).unique()
    }
}

impl Ord for Polyomino {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        if self.height() != other.height() {
            num_to_ord(other.height() - self.height())
        } else if self.width() != other.width() {
            num_to_ord(other.width() - self.width())
        } else {
            for y in 0..self.height() {
                for x in 0..self.width() {
                    let p = Point::new(x, y);
                    if self.has(&p) != other.has(&p) {
                        if other.has(&p) && !self.has(&p) {
                            return Greater;
                        } else {
                            return Less;
                        }
                    }
                }
            }
            Equal
        }
    }
}

impl PartialOrd for Polyomino {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn num_to_ord(n: i16) -> Ordering {
    if n > 0 {
        Greater
    } else if n < 0 {
        Less
    } else {
        Equal
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
