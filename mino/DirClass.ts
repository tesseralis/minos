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

  regex() {
    return regexes[this.name()]
  }

  static all() {
    return Object.values(classNamesMap)
  }
}

const classNamesMap: Record<string, DirClass> = {
  rectangle: new DirClass(4, 4),
  wedge: new DirClass(4, 3),
  staircase: new DirClass(4, "2-para"),
  stack: new DirClass(4, "2-meta"),
  fork: new DirClass(4, 1),
  "bar chart": new DirClass(3, "2-meta"),
  diamond: new DirClass(4, 0),
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
  wedge: "wedge",
  staircase: "stair",
  stack: "stack",
  fork: "fork",
  "bar chart": "bar",
  diamond: "diam",
  wing: "wing",
  crescent: "cres",
  antler: "ant",
  "range chart": "range",
  "bent tree": "btree",
  tree: "tree",
  other: "other",
}

const regexes: Record<string, string> = {
  rectangle: "ruld",
  wedge: "ru(ru)*ld",
  staircase: "ru(ru)*ld(ld)*",
  stack: "ru(ru)*(lu)*ld",
  fork: "ru(ru)*(lu)*ld(ld)*",
  "bar chart": "ru(ru|lu)*ld",
  diamond: "ru(ru)*(lu)*ld(ld)*(rd)*",
  wing: "ru(ru|lu)*ld(ld)*",
  crescent: "ru(ru|lu)*ld(ld)*(rd)*",
  antler: "ru(ru|lu|ld(ld)*lu)*ld(ld)*",
  "range chart": "ru(ru|lu)*ld(ld|rd)*",
  "bent tree": "ru(ru|lu|ld(ld)*lu)ld(ld)*(rd)*",
  tree: "ru(ru|lu|ld(ld|rd)*lu)*ld(ld|rd)*",
  other: "",
}
