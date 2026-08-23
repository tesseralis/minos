#[derive(Copy, Clone, PartialEq, Eq)]
pub enum Direction {
    Left,
    Right,
    Up,
    Down,
}

use Direction::*;
const DIRECTIONS: [Direction; 4] = [Left, Right, Up, Down];

impl Direction {
    pub fn all() -> impl Iterator<Item = Direction> {
        DIRECTIONS.into_iter()
    }

    pub fn turn_right(&self) -> Direction {
        match self {
            Left => Up,
            Up => Right,
            Right => Down,
            Down => Left,
        }
    }

    pub fn turn_left(&self) -> Direction {
        match self {
            Left => Down,
            Up => Left,
            Right => Up,
            Down => Right,
        }
    }
    pub fn flip(&self) -> Direction {
        match self {
            Left => Right,
            Up => Down,
            Right => Left,
            Down => Up,
        }
    }
}
