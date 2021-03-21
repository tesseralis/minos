import Vector from "vector"
import { EdgeList } from "../edges"

describe("EdgeList", () => {
  describe(".isInverse()", () => {
    it("fails if the edge lists have different lengths", () => {
      const first = new EdgeList([
        { start: new Vector(0, 0), dir: "down" },
        { start: new Vector(0, 1), dir: "left" },
      ])
      const second = new EdgeList([])
      expect(first.isInverse(second)).toBe(false)
    })

    it("works on the successful case", () => {
      const first = new EdgeList([
        { start: new Vector(0, 0), dir: "down" },
        { start: new Vector(0, 1), dir: "left" },
      ])
      const second = new EdgeList([
        { start: new Vector(0, 0), dir: "right" },
        { start: new Vector(1, 0), dir: "up" },
      ])
      expect(first.isInverse(second)).toBe(true)
    })
  })

  describe(".isPalindrome()", () => {
    it("returns true if the list is empty", () => {
      const edges = new EdgeList([])
      expect(edges.isPalindrome()).toBe(true)
    })

    it("it works for lists of odd length", () => {
      const edges = new EdgeList([
        { start: new Vector(0, 0), dir: "down" },
        { start: new Vector(0, 1), dir: "left" },
        { start: new Vector(-1, 1), dir: "down" },
      ])
      expect(edges.isPalindrome()).toBe(true)
    })

    it("works for lists of even length", () => {
      const edges = new EdgeList([
        { start: new Vector(0, 0), dir: "down" },
        { start: new Vector(0, 1), dir: "left" },
        { start: new Vector(-1, 1), dir: "left" },
        { start: new Vector(-2, 1), dir: "down" },
      ])
      expect(edges.isPalindrome()).toBe(true)
    })

    it("works in the falsy case", () => {
      const edges = new EdgeList([
        { start: new Vector(0, 0), dir: "down" },
        { start: new Vector(0, 1), dir: "left" },
      ])
      expect(edges.isPalindrome()).toBe(false)
    })
  })
})
