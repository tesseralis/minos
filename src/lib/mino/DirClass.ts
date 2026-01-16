import { repeat } from "lodash-es"

export type Level = 0 | 1 | "2-cis" | "2-trans" | 3 | 4

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
      Object.entries(classNamesMap).find(([, value]) =>
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

  stateDiagram() {
    return stateDiagrams[this.name()]
  }

  static all() {
    return Object.values(classNamesMap)
  }
}

type Direction = "ru" | "lu" | "ld" | "rd"

const classNamesMap: Record<string, DirClass> = {
  rectangle: new DirClass(4, 4),
  wedge: new DirClass(4, 3),
  staircase: new DirClass(4, "2-trans"),
  stack: new DirClass(4, "2-cis"),
  fork: new DirClass(4, 1),
  "bar chart": new DirClass(3, "2-cis"),
  diamond: new DirClass(4, 0),
  wing: new DirClass(3, 1),
  crescent: new DirClass(3, 0),
  antler: new DirClass("2-cis", 1),
  "range chart": new DirClass("2-trans", 0),
  "bent tree": new DirClass("2-cis", 0),
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

interface StateDiagramData {
  /** Whether the `lu` node exists */
  lu?: boolean
  /** Whether the `rd` node exists */
  rd?: boolean
  /** Whether there is an arrow between `lu` and `rd` */
  lu_rd?: boolean
  repeats?: Direction[]
  backward?: Direction[]
}

const stateDiagrams: Record<string, StateDiagramData> = {
  rectangle: {},
  wedge: { repeats: ["ru"] },
  staircase: {
    repeats: ["ru", "ld"],
  },
  stack: {
    lu: true,
    repeats: ["ru", "lu"],
  },
  fork: {
    lu: true,
    repeats: ["ru", "lu", "ld"],
  },
  "bar chart": {
    lu: true,
    repeats: ["ru", "lu"],
    backward: ["ru"],
  },
  diamond: {
    lu: true,
    rd: true,
    repeats: ["ru", "lu", "ld", "rd"],
  },
  wing: {
    lu: true,
    repeats: ["ru", "lu", "ld"],
    backward: ["ru"],
  },
  crescent: {
    lu: true,
    rd: true,
    repeats: ["ru", "lu", "ld", "rd"],
    backward: ["ru"],
  },
  antler: {
    lu: true,
    repeats: ["ru", "lu", "ld"],
    backward: ["ru", "lu"],
  },
  "range chart": {
    lu: true,
    rd: true,
    repeats: ["ru", "lu", "ld", "rd"],
    backward: ["ru", "ld"],
  },
  "bent tree": {
    lu: true,
    rd: true,
    repeats: ["ru", "lu", "ld", "rd"],
    backward: ["ru", "lu"],
  },
  tree: {
    lu: true,
    rd: true,
    repeats: ["ru", "lu", "ld", "rd"],
    backward: ["ru", "lu", "ld"],
  },
  other: {
    lu: true,
    rd: true,
    lu_rd: true,
    repeats: ["ru", "lu", "ld", "rd"],
    backward: ["ru", "lu", "ld", "rd"],
  },
}
