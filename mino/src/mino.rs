use std::{
    cmp::Ordering::{self, Equal},
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
    pub fn new_with_dims(mut data: MinoData, width: i16, height: i16) -> Self {
        data.sort();
        Polyomino {
            data,
            width,
            height,
        }
    }

    pub fn new(data: MinoData) -> Self {
        let width = data.iter().map(|p| p.x).max().unwrap() + 1;
        let height = data.iter().map(|p| p.y).max().unwrap() + 1;
        Self::new_with_dims(data, width, height)
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
        self.neighbors().map(|p| self.add_square(p))
    }

    pub fn free_children(&self) -> impl Iterator<Item = Polyomino> + '_ {
        self.children()
            .map(|child| child.free())
            .unique_with_hasher(FxBuildHasher)
    }

    fn add_square(&self, p: Point) -> Polyomino {
        if p.x < 0 {
            let mut mapped: MinoData = self.coords().map(|p| *p + RIGHT).collect();
            mapped.push(Point::new(0, p.y));
            Polyomino::new_with_dims(mapped, self.width() + 1, self.height())
        } else if p.y < 0 {
            let mut mapped: MinoData = self.coords().map(|p| *p + DOWN).collect();
            mapped.push(Point::new(p.x, 0));
            Polyomino::new_with_dims(mapped, self.width(), self.height() + 1)
        } else {
            let mut mapped: MinoData = self.data.clone();
            mapped.push(p);
            let width = self.width() + if p.x >= self.width() { 1 } else { 0 };
            let height = self.height() + if p.y >= self.height() { 1 } else { 0 };
            Polyomino::new_with_dims(mapped, width, height)
        }
    }
}

impl Hash for Polyomino {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.data.hash(state);
    }
}

impl Ord for Polyomino {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        if self.size() != other.size() {
            other.size().cmp(&self.size())
        } else if self.height() != other.height() {
            other.height().cmp(&self.height())
        } else if self.width() != other.width() {
            other.width().cmp(&self.width())
        } else {
            // This relies on the mino data being sorted
            for (x, y) in zip(self.coords(), other.coords()) {
                if x != y {
                    return x.cmp(y);
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
