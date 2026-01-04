import { unescapeClass } from "../helpers"

export const load = async ({ params }) => {
  const post = await import(`./subpages/${params.dirClass}.svx`)
  return {
    content: post.default,
    dirClass: unescapeClass(params.dirClass),
  }
}
