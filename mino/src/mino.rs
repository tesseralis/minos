use crate::point::{Point, DOWN, RIGHT};
use itertools::Itertools;

type MinoData = Vec<Point>;

pub struct Polyomino {
    pub data: MinoData,
}

impl Polyomino {
    pub fn size(&self) -> usize {
        self.data.len()
    }
    pub fn width(&self) -> i16 {
        self.data.iter().map(|p| p.x).sum()
    }
    pub fn height(&self) -> i16 {
        self.data.iter().map(|p| p.y).sum()
    }
    pub fn neighbors(&self) -> impl Iterator<Item = Point> + '_ {
        self.data
            .clone()
            .into_iter()
            .flat_map(|p| p.neighbors())
            .filter(|p| {
                !self.data.contains(p)
                    && in_range(p.x, 0, self.width())
                    && in_range(p.y, 0, self.height())
            })
            .unique()
    }

    pub fn children(&self) -> impl Iterator<Item = Polyomino> + '_ {
        self.neighbors().map(|p| Polyomino {
            data: add_square(&self.data, p),
        })
    }
}

fn in_range(n: i16, min: i16, max: i16) -> bool {
    n >= min && n < max
}

fn add_square(data: &MinoData, p: Point) -> MinoData {
    if p.x < 0 {
        let mut mapped = data.iter().map(|p| *p + RIGHT).collect_vec();
        mapped.push(p);
        mapped
    } else if p.y < 0 {
        let mut mapped = data.iter().map(|p| *p + DOWN).collect_vec();
        mapped.push(p);
        mapped
    } else {
        let mut mapped = data.clone();
        mapped.push(p);
        mapped
    }
}
