use std::collections::HashSet;

use itertools::Itertools;
use rustc_hash::FxBuildHasher;

use crate::classes::DirClassLevel::TwoOpp;
use crate::mino::Polyomino;
use crate::point::Direction::{self, *};
use crate::point::{Point, DIRECTIONS};

#[derive(Clone, Copy, PartialEq, Eq)]
enum AnchorPos {
    Start,
    End,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Corner {
    x: AnchorPos,
    y: AnchorPos,
}

impl Corner {}

static CORNERS: [Corner; 4] = [
    Corner {
        x: AnchorPos::Start,
        y: AnchorPos::Start,
    },
    Corner {
        x: AnchorPos::Start,
        y: AnchorPos::End,
    },
    Corner {
        x: AnchorPos::End,
        y: AnchorPos::Start,
    },
    Corner {
        x: AnchorPos::End,
        y: AnchorPos::End,
    },
];

#[derive(Clone, Copy, PartialEq, Eq, Hash, Debug)]
pub enum DirClassLevel {
    Zero,
    One,
    TwoAdj,
    TwoOpp,
    Three,
    Four,
}

impl DirClassLevel {
    pub fn new(level: usize, across: bool) -> DirClassLevel {
        use DirClassLevel::*;
        match level {
            0 => Zero,
            1 => One,
            2 => {
                if across {
                    TwoOpp
                } else {
                    TwoAdj
                }
            }
            3 => Three,
            4 => Four,
            _ => panic!("Unknown number {}", level),
        }
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Hash, Debug)]
pub struct DirClass {
    pub ortho: DirClassLevel,
    pub diag: DirClassLevel,
}

pub trait GetDirClass {
    fn get_dir_class(&self) -> DirClass {
        let dir_diags = CORNERS
            .iter()
            .filter(|corner| self.is_corner_directed(**corner))
            .map(|p| *p)
            .collect_vec();

        let diag = DirClassLevel::new(dir_diags.len(), has_opposite_corners(&dir_diags));
        if dir_diags.len() > 2 || diag == TwoOpp {
            return DirClass {
                diag,
                ortho: DirClassLevel::Four,
            };
        }
        let anchor_sides = dir_diags
            .iter()
            .flat_map(|corner| corner_directions(*corner))
            .collect_vec();

        let dir_sides = DIRECTIONS
            .iter()
            .map(|dir| *dir)
            .filter(|dir| {
                if anchor_sides.contains(dir) {
                    true
                } else {
                    self.is_side_directed(*dir)
                }
            })
            .collect_vec();
        let ortho = DirClassLevel::new(dir_sides.len(), has_opposite_sides(&dir_sides));

        DirClass { diag, ortho }
    }

    fn is_corner_directed(&self, corner: Corner) -> bool;

    fn is_side_directed(&self, dir: Direction) -> bool;
}

impl GetDirClass for Polyomino {
    fn is_corner_directed(&self, corner: Corner) -> bool {
        let point = point_at_corner(corner, self.dims);
        if !self.has(&point) {
            return false;
        }
        let mut visited = HashSet::with_hasher(FxBuildHasher);
        visited.insert(point);
        let mut queue = vec![point];
        while queue.len() > 0 {
            let current = queue.pop().unwrap();
            for nbr_dir in corner_directions(corner) {
                let nbr = current.move_dir(nbr_dir);
                if self.has(&nbr) && !visited.contains(&nbr) {
                    visited.insert(nbr);
                    queue.push(nbr);
                }
            }
        }

        visited.len() == self.size()
    }

    fn is_side_directed(&self, dir: Direction) -> bool {
        let start = check_points_at_side(self, dir);
        match start {
            None => false,
            Some(start) => {
                let mut visited = HashSet::with_hasher(FxBuildHasher);
                visited.insert(start);
                let mut stack = vec![start];
                while stack.len() > 0 {
                    let current = stack.pop().unwrap();
                    for nbr_dir in [dir, dir.turn_left(), dir.turn_right()] {
                        let nbr = current.move_dir(nbr_dir);
                        if self.has(&nbr) && !visited.contains(&nbr) {
                            visited.insert(nbr);
                            stack.push(nbr);
                        }
                    }
                }
                visited.len() == self.size()
            }
        }
    }
}

fn point_at_corner(corner: Corner, dims: Point) -> Point {
    let x = match corner.x {
        AnchorPos::Start => 0,
        AnchorPos::End => dims.x - 1,
    };
    let y = match corner.y {
        AnchorPos::Start => 0,
        AnchorPos::End => dims.y - 1,
    };
    Point::new(x, y)
}

fn check_points_at_side(mino: &Polyomino, dir: Direction) -> Option<Point> {
    match dir {
        Right | Left => {
            let x = if dir == Right { 0 } else { mino.width() - 1 };
            let mut point = None;
            let mut found_hole = false;
            for y in 0..mino.height() {
                let new_point = Point::new(x, y);
                if mino.has(&new_point) {
                    if found_hole {
                        return None;
                    }
                    point = Some(new_point);
                } else if point.is_some() {
                    found_hole = true;
                }
            }
            point
        }
        Up | Down => {
            let y = if dir == Down { 0 } else { mino.height() - 1 };
            let mut point = None;
            let mut found_hole = false;
            for x in 0..mino.width() {
                let new_point = Point::new(x, y);
                if mino.has(&new_point) {
                    if found_hole {
                        return None;
                    }
                    point = Some(new_point);
                } else if point.is_some() {
                    found_hole = true;
                }
            }
            point
        }
    }
}

fn has_opposite_corners(corners: &[Corner]) -> bool {
    if corners.len() > 2 {
        true
    } else if corners.len() < 2 {
        false
    } else {
        let first = corners.get(0).unwrap();
        let second = corners.get(1).unwrap();
        first.x != second.x && first.y != second.y
    }
}

fn has_opposite_sides(sides: &[Direction]) -> bool {
    if sides.len() > 2 {
        true
    } else if sides.len() < 2 {
        false
    } else {
        let first = sides.get(0).unwrap();
        let second = sides.get(1).unwrap();
        first.flip() == *second
    }
}

fn corner_directions(corner: Corner) -> impl Iterator<Item = Direction> {
    let x_dir = if corner.x == AnchorPos::End {
        Left
    } else {
        Right
    };
    let y_dir = if corner.y == AnchorPos::End { Up } else { Down };
    [x_dir, y_dir].into_iter()
}
