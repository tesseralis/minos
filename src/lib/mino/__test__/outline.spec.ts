import { describe, it, expect } from "vitest"
import { getEdges, getEdgesInner } from "../outline"
import { encodeVec } from "../data"

describe("polyomino outline", () => {
  describe("getEdges()", () => {
    it("correctly gets the edge list of the L tetromino", () => {
      const coords: [number, number][] = [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ]
      const edges = getEdges(coords.map(encodeVec))
      const expected = [
        "down",
        "left",
        "left",
        "down",
        "right",
        "right",
        "right",
        "up",
        "up",
        "left",
      ]
      expect(edges.data.map((e) => e.dir)).toEqual(expected)
    })
  })

  describe("getEdgesInner()", () => {
    it("works on polykings", () => {
      const coords: [number, number][] = [
        [0, 0],
        [1, 1],
      ]
      const edges = getEdgesInner(coords.map(encodeVec))
      const expected = [
        "down",
        "right",
        "down",
        "right",
        "up",
        "left",
        "up",
        "left",
      ]
      expect(edges.data.map((e) => e.dir)).toEqual(expected)
    })
  })
})
