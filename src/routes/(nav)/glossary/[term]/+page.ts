import { capitalize } from "lodash-es"

export const load = async ({ params }) => {
  const post = await import(`./subpages/${params.term}.svx`)
  return {
    title: capitalize(params.term.replace("-", " ")),
    content: post.default,
  }
}
