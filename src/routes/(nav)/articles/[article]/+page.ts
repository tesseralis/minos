import { capitalize } from "lodash-es"

export const load = async ({ params }) => {
  const post = await import(`./subpages/${params.article}.svx`)
  return {
    content: post.default,
  }
}
