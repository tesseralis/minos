import { EdgeList } from "../edges"

describe("EdgeList", () => {
  describe(".isInverse()", () => {
    it("fails if the edge lists have different lengths", () => {
      const first = EdgeList.of([
        { start: [0, 0], dir: "down" },
        { start: [0, 1], dir: "left" },
      ])
      const second = EdgeList.of([])
      expect(first.isInverse(second)).toBe(false)
    })

    it("works on the successful case", () => {
      const first = EdgeList.of([
        { start: [0, 0], dir: "down" },
        { start: [0, 1], dir: "left" },
      ])
      const second = EdgeList.of([
        { start: [0, 0], dir: "right" },
        { start: [1, 0], dir: "up" },
      ])
      expect(first.isInverse(second)).toBe(true)
    })
  })

  describe(".isPalindrome()", () => {
    it("returns true if the list is empty", () => {
      const edges = EdgeList.of([])
      expect(edges.isPalindrome()).toBe(true)
    })

    it("it works for lists of odd length", () => {
      const edges = EdgeList.of([
        { start: [0, 0], dir: "down" },
        { start: [0, 1], dir: "left" },
        { start: [-1, 1], dir: "down" },
      ])
      expect(edges.isPalindrome()).toBe(true)
    })

    it("works for lists of even length", () => {
      const edges = EdgeList.of([
        { start: [0, 0], dir: "down" },
        { start: [0, 1], dir: "left" },
        { start: [-1, 1], dir: "left" },
        { start: [-2, 1], dir: "down" },
      ])
      expect(edges.isPalindrome()).toBe(true)
    })

    it("works in the falsy case", () => {
      const edges = EdgeList.of([
        { start: [0, 0], dir: "down" },
        { start: [0, 1], dir: "left" },
      ])
      expect(edges.isPalindrome()).toBe(false)
    })
  })

  describe(".outline()", () => {
    it("only lists changes in direction", () => {
      const edges = EdgeList.of([
        { start: [0, 0], dir: "down" },
        { start: [0, 1], dir: "down" },
        { start: [0, 2], dir: "right" },
        { start: [1, 2], dir: "up" },
        { start: [1, 1], dir: "up" },
        { start: [1, 0], dir: "left" },
      ])
      const expected = [
        [0, 0],
        [0, 2],
        [1, 2],
        [1, 0],
      ]
      expect(edges.outline().map((p) => p.toArray())).toEqual(expected)
    })
  })
})
