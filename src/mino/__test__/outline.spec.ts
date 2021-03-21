import Vector from "vector"
import { getEdges, getOutline } from "../outline"

describe("polyomino outline", () => {
  describe("getEdges()", () => {
    it("correctly gets the edge list of the L tetromino", () => {
      const coords: [number, number][] = [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ]
      const edges = [...getEdges(coords.map((p) => new Vector(...p)))]
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
      expect(edges.map((e) => e.dir)).toEqual(expected)
    })
  })

  describe("getOutline()", () => {
    it("correctly gets the outline of the L tetromino", () => {
      const coords: [number, number][] = [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ]
      const outline = [...getOutline(coords.map((p) => new Vector(...p)))]
      const expected = [
        [2, 0],
        [2, 1],
        [0, 1],
        [0, 2],
        [3, 2],
        [3, 0],
      ]
      expect(outline.map((v) => v.toArray())).toEqual(expected)
    })
  })
})
