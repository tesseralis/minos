use std::ops;

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct Point {
    pub x: i16,
    pub y: i16,
}

pub static ZERO: Point = Point::new(0, 0);
pub static UP: Point = Point::new(0, -1);
pub static DOWN: Point = Point::new(0, 1);
pub static LEFT: Point = Point::new(-1, 0);
pub static RIGHT: Point = Point::new(1, 0);

impl Point {
    pub const fn new(x: i16, y: i16) -> Self {
        Point { x, y }
    }

    pub fn neighbors(&self) -> Vec<Point> {
        return vec![*self + UP, *self + DOWN, *self + LEFT, *self + RIGHT];
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
