use std::ops;

use crate::direction::Direction;

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
        Direction::all().map(|dir| self.move_dir(dir))
    }

    pub fn move_dir(&self, dir: Direction) -> Point {
        match dir {
            Direction::Left => Point::new(self.x - 1, self.y),
            Direction::Right => Point::new(self.x + 1, self.y),
            Direction::Up => Point::new(self.x, self.y - 1),
            Direction::Down => Point::new(self.x, self.y + 1),
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
