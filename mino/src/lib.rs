pub struct Point {
    pub x: u16,
    pub y: u16,
}

impl Point {
    pub fn neighbors() {}
}

pub struct Polyomino {
    pub data: Vec<Point>,
}

impl Polyomino {
    pub fn size(&self) -> usize {
        self.data.len()
    }
    pub fn width(&self) -> u16 {
        self.data.iter().map(|p| p.x).sum()
    }
    pub fn height(&self) -> u16 {
        self.data.iter().map(|p| p.y).sum()
    }
    pub fn neighbors(&self) {}
}
