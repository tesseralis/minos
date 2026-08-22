use std::{
    cmp::Ordering::{self, Equal, Greater, Less},
    hash::{Hash, Hasher},
    iter::zip,
};

use crate::{
    point::{Point, DOWN, RIGHT},
    transform::Transformable,
};
use itertools::Itertools;
use rustc_hash::FxBuildHasher;

type MinoData = Vec<Point>;

#[derive(PartialEq, Eq, Clone)]
pub struct Polyomino {
    data: MinoData,
    width: i16,
    height: i16,
}

impl Polyomino {
    pub fn new(mut data: MinoData) -> Self {
        let width = data.iter().map(|p| p.x).max().unwrap() + 1;
        let height = data.iter().map(|p| p.y).max().unwrap() + 1;
        data.sort();
        Polyomino {
            data,
            width,
            height,
        }
    }

    pub fn size(&self) -> usize {
        self.data.len()
    }

    pub fn width(&self) -> i16 {
        self.width
    }

    pub fn height(&self) -> i16 {
        self.height
    }

    pub fn coords(&self) -> impl Iterator<Item = &Point> {
        self.data.iter()
    }

    pub fn has(&self, item: &Point) -> bool {
        self.data.contains(item)
    }

    pub fn neighbors(&self) -> impl Iterator<Item = Point> + '_ {
        self.data
            .iter()
            .flat_map(|p| p.neighbors())
            .filter(|p| !self.has(p))
            .unique_with_hasher(FxBuildHasher)
    }

    pub fn children(&self) -> impl Iterator<Item = Polyomino> + '_ {
        self.neighbors()
            .map(|p| Polyomino::new(add_square(&self.data, p)))
    }

    pub fn free_children(&self) -> impl Iterator<Item = Polyomino> + '_ {
        self.children()
            .map(|child| child.free())
            .unique_with_hasher(FxBuildHasher)
    }
}

impl Hash for Polyomino {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.data.hash(state);
    }
}

impl Ord for Polyomino {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        if self.height() != other.height() {
            num_to_ord(other.height() - self.height())
        } else if self.width() != other.width() {
            num_to_ord(other.width() - self.width())
        } else {
            // This relies on the mino data being sorted
            for (x, y) in zip(self.coords(), other.coords()) {
                if x != y {
                    if x > y {
                        return Greater;
                    } else {
                        return Less;
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
        mapped.push(Point::new(0, p.y));
        mapped
    } else if p.y < 0 {
        let mut mapped: MinoData = data.iter().map(|p| *p + DOWN).collect();
        mapped.push(Point::new(p.x, 0));
        mapped
    } else {
        let mut mapped: MinoData = data.clone();
        mapped.push(p);
        mapped
    }
}
