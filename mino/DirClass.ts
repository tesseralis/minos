type Level = 0 | 1 | "2-meta" | "2-para" | 3 | 4

export default class DirClass {
  ortho: Level
  diag: Level

  constructor(ortho: Level, diag: Level) {
    this.ortho = ortho
    this.diag = diag
  }

  static fromName(name: string) {
    return classNamesMap[name] ?? new DirClass(0, 0)
  }

  equals(other: DirClass) {
    return this.ortho === other.ortho && this.diag === other.diag
  }

  name() {
    return (
      Object.entries(classNamesMap).find(([name, value]) =>
        this.equals(value),
      )?.[0] ?? "other"
    )
  }

  code() {
    return codes[this.name()]
  }

  static all() {
    return Object.values(classNamesMap)
  }

  // symbol
  // subclasses/superclasses
  // regex
}

const classNamesMap: Record<string, DirClass> = {
  rectangle: new DirClass(4, 4),
  "Ferrers diagram": new DirClass(4, 3),
  staircase: new DirClass(4, "2-para"),
  stack: new DirClass(4, "2-meta"),
  fork: new DirClass(4, 1),
  "bar chart": new DirClass(3, "2-meta"),
  cross: new DirClass(4, 0),
  wing: new DirClass(3, 1),
  crescent: new DirClass(3, 0),
  antler: new DirClass("2-meta", 1),
  "range chart": new DirClass("2-para", 0),
  "bent tree": new DirClass("2-meta", 0),
  tree: new DirClass(1, 0),
  other: new DirClass(0, 0),
}

const codes: Record<string, string> = {
  rectangle: "rect",
  "Ferrers diagram": "ferr",
  staircase: "stair",
  stack: "stack",
  fork: "fork",
  "bar chart": "bar",
  cross: "cross",
  wing: "wing",
  crescent: "cres",
  antler: "ant",
  "range chart": "range",
  "bent tree": "btree",
  tree: "tree",
  other: "other",
}
