use std::ops;

use num::Num;

use crate::direction::Direction;

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct Point<T: Num + Copy> {
    pub x: T,
    pub y: T,
}

impl<T: Num + Copy> Point<T> {
    pub const fn new(x: T, y: T) -> Self {
        Point { x, y }
    }

    pub fn neighbors(&self) -> impl Iterator<Item = Self> + use<'_, T> {
        Direction::all().map(|dir| self.move_dir(dir))
    }

    pub fn move_dir(&self, dir: Direction) -> Self {
        match dir {
            Direction::Left => Point::new(self.x - T::one(), self.y),
            Direction::Right => Point::new(self.x + T::one(), self.y),
            Direction::Up => Point::new(self.x, self.y - T::one()),
            Direction::Down => Point::new(self.x, self.y + T::one()),
        }
    }

    pub fn flip(&self) -> Self {
        Point::new(self.y, self.x)
    }
}

impl<T: Num + Copy> ops::Add<Point<T>> for Point<T> {
    type Output = Self;

    fn add(self, p: Self) -> Self {
        Point::new(self.x + p.x, self.y + p.y)
    }
}

impl<T: Num + Copy> ops::Sub<Point<T>> for Point<T> {
    type Output = Self;

    fn sub(self, p: Self) -> Self {
        Point::new(self.x - p.x, self.y - p.y)
    }
}
