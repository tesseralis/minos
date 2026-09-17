use std::collections::HashSet;

use itertools::Itertools;
use rustc_hash::{FxBuildHasher, FxHashSet};

use crate::classes::DirClassLevel::TwoOpp;
use crate::direction::Direction::{self, *};
use crate::mino::Polyomino;
use crate::point::Point;

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

const CORNERS: [Corner; 4] = [
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
            .into_iter()
            .filter(|corner| self.is_corner_directed(*corner))
            .map(|p| p)
            .collect_vec();

        let diag = DirClassLevel::new(dir_diags.len(), has_opposite_corners(&dir_diags));
        if dir_diags.len() > 2 || diag == TwoOpp {
            return DirClass {
                diag,
                ortho: DirClassLevel::Four,
            };
        }
        let anchor_sides = dir_diags
            .into_iter()
            .flat_map(|corner| corner_directions(corner))
            .collect_vec();

        let dir_sides = Direction::all()
            .map(|dir| dir)
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
        let directions: Vec<_> = corner_directions(corner).map(|dir| dir.flip()).collect();
        self.coords()
            .all(|p| *p == point || (directions.iter().any(|dir| self.has(&p.move_dir(*dir)))))
    }

    fn is_side_directed(&self, dir: Direction) -> bool {
        let start = check_points_at_side(self, dir);
        match start {
            None => false,
            Some(start) => {
                let found = bfs(self, &[dir, dir.turn_left(), dir.turn_right()], start);
                found.len() == self.size()
            }
        }
    }
}

fn point_at_corner(corner: Corner, dims: Point<i16>) -> Point<i16> {
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

fn bfs(mino: &Polyomino, nbrs: &[Direction], start: Point<i16>) -> FxHashSet<Point<i16>> {
    let mut visited = HashSet::with_hasher(FxBuildHasher);
    visited.insert(start);
    let mut stack = vec![start];
    while let Some(current) = stack.pop() {
        for nbr_dir in nbrs.into_iter() {
            let nbr = current.move_dir(*nbr_dir);
            if mino.has(&nbr) && !visited.contains(&nbr) {
                visited.insert(nbr);
                stack.push(nbr);
            }
        }
    }
    visited
}

fn check_points_at_side(mino: &Polyomino, dir: Direction) -> Option<Point<i16>> {
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
    match corners {
        [_, _, _, ..] => true,
        [first, second] => first.x != second.x && first.y != second.y,
        _ => false,
    }
}

fn has_opposite_sides(sides: &[Direction]) -> bool {
    match sides {
        [_, _, _, ..] => true,
        [first, second] => first.flip() == *second,
        _ => false,
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
