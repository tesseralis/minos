use std::ops;

#[derive(Copy, Clone)]
pub enum Direction {
    Left,
    Right,
    Up,
    Down,
}
use Direction::*;

const DIRECTIONS: [Direction; 4] = [Left, Right, Up, Down];

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct Point {
    pub x: i16,
    pub y: i16,
}

impl Point {
    pub const fn new(x: i16, y: i16) -> Self {
        Point { x, y }
    }

    pub fn neighbors(&self) -> impl Iterator<Item = Point> + use<'_> {
        DIRECTIONS.iter().map(|dir| self.move_dir(*dir))
    }

    pub fn move_dir(&self, dir: Direction) -> Point {
        match dir {
            Left => Point::new(self.x - 1, self.y),
            Right => Point::new(self.x + 1, self.y),
            Up => Point::new(self.x, self.y - 1),
            Down => Point::new(self.x, self.y + 1),
        }
    }

    pub fn flip(&self) -> Point {
        Point::new(self.y, self.x)
    }
}

impl ops::Add<Point> for Point {
    type Output = Point;

    fn add(self, p: Point) -> Point {
        Point::new(self.x + p.x, self.y + p.y)
    }
}

impl ops::Sub<Point> for Point {
    type Output = Point;

    fn sub(self, p: Point) -> Point {
        Point::new(self.x - p.x, self.y - p.y)
    }
}
