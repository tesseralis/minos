export const load = async ({ params }) => {
  return {
    n: +params.n,
    l: +params.l,
    w: +params.w,
  }
}
