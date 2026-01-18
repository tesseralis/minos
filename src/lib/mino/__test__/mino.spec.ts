import { describe, it, expect } from "vitest"
import { Polyomino } from ".."
import { create, getKey } from "../dataArray"
import Vector from "$lib/vector"

describe("mino", () => {
  describe("strings", () => {
    it("properly converts to and from string", () => {
      const sampleStrings = ["1", "11", "111_100_111", "1010_1111_0101"]
      for (const string of sampleStrings) {
        const mino = Polyomino.fromString(string)
        expect(mino.toString()).toEqual(string)
      }
    })
  })

  describe("order", () => {
    it("correctly gets mino size", () => {
      const minos = [
        Polyomino.fromString("1"),
        Polyomino.fromString("11"),
        Polyomino.fromString("11_01"),
        Polyomino.fromString("111_001"),
        Polyomino.fromString("010_111_010"),
      ]
      minos.forEach((mino, i) => {
        expect(mino.order).toEqual(i + 1)
      })
    })
  })

  describe("fromCoords", () => {
    it("correctly creates an L tetromino", () => {
      const actual = Polyomino.fromCoords([
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ])
      const expected = Polyomino.fromString("10_10_11")
      expect(actual.toString()).toEqual(expected.toString())
    })
  })

  describe("coords", () => {
    it("correctly lists coordinates", () => {
      const mino = Polyomino.of("1")
      const coords = mino.coords()
      expect(coords).toEqual([new Vector(0, 0)])
    })
  })

  describe("neighbors", () => {
    it("correctly identifies neighbors", () => {
      const mino = Polyomino.of("1")
      expect(mino.neighbors().map((v) => [...v])).toEqual([
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ])
    })
  })

  describe("children", () => {
    it("works on monomino", () => {
      const children = Polyomino.of("1").children()
      expect([...children.values().map((c) => c.toString())]).toEqual([
        "11",
        "11",
        "1_1",
        "1_1",
      ])
    })
  })

  describe("freeChildren", () => {
    it("works on monomino", () => {
      const children = Polyomino.of("1").freeChildren()
      expect([...children.values().map((c) => c.toString())]).toEqual(["11"])
    })
    it("works on domino", () => {
      const children = Polyomino.of("11").freeChildren()
      expect([...children.values().map((c) => c.toString())]).toEqual([
        "111",
        "01_11",
      ])
    })
  })

  describe("freeParents", () => {
    it("works on domino", () => {
      const parents = Polyomino.of("11").freeParents()
      expect([...parents.values().map((p) => p.toString())]).toEqual(["1"])
    })
  })
})
