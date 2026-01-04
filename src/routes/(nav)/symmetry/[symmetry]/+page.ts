import type { Symmetry } from "$lib/mino"

export const load = async ({ params }) => {
  const post = await import(`./subpages/${params.symmetry}.svx`)
  return {
    content: post.default,
    symmetry: params.symmetry as Symmetry,
  }
}
