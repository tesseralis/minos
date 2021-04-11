import Vector from "vector"
import { getEdges } from "../outline"

describe("polyomino outline", () => {
  describe("getEdges()", () => {
    it("correctly gets the edge list of the L tetromino", () => {
      const coords: [number, number][] = [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ]
      const edges = getEdges(coords.map(Vector.fromArray))
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
})
