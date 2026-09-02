import { decode, encode } from "$lib/mino/data"
import { describe, expect, it } from "vitest"

describe("encode and decode", () => {
  it("works on negative numbers", () => {
    expect(decode(encode(-1, 2))).toEqual([-1, 2])
    expect(decode(encode(1, -2))).toEqual([1, -2])
    expect(decode(encode(-1, -2))).toEqual([-1, -2])
  })
})
