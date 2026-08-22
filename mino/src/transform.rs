use crate::mino::Polyomino;
use crate::point::Point;

#[derive(Copy, Clone)]
pub enum Transform {
    Identity,
    RotateLeft,
    RotateHalf,
    RotateRight,
    FlipHoriz,
    FlipVert,
    FlipMainDiag,
    FlipMinorDiag,
}

impl Transform {
    fn all() -> impl Iterator<Item = Transform> {
        use Transform::*;
        vec![
            Identity,
            RotateLeft,
            RotateHalf,
            RotateRight,
            FlipHoriz,
            FlipVert,
            FlipMainDiag,
            FlipMinorDiag,
        ]
        .into_iter()
    }
}

pub trait Transformable {
    fn apply(&self, trans: Transform) -> Self;

    fn all(&self) -> impl Iterator<Item = Self>
    where
        Self: Sized,
    {
        Transform::all().map(|trans| self.apply(trans))
    }

    fn free(&self) -> Self
    where
        Self: Sized + Ord,
    {
        self.all().min().unwrap()
    }
}

impl Transformable for Polyomino {
    fn apply(&self, trans: Transform) -> Self {
        Polyomino {
            data: self
                .data
                .iter()
                .map(|p| transform_point(*p, self.width(), self.height(), trans))
                .collect(),
        }
    }
}

fn transform_point(p: Point, w: i16, h: i16, trans: Transform) -> Point {
    use Transform::*;
    match trans {
        Identity => p,
        RotateHalf => Point::new(w - 1, h - 1) - p,
        RotateLeft => Point::new(p.y, w - 1 - p.x),
        RotateRight => Point::new(h - 1 - p.y, p.x),
        FlipVert => Point::new(p.x, h - 1 - p.y),
        FlipHoriz => Point::new(w - 1 - p.x, p.y),
        FlipMainDiag => Point::new(p.y, p.x),
        FlipMinorDiag => Point::new(h - 1 - p.y, w - 1 - p.x),
    }
}
