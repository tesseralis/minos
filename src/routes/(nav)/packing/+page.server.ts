export const load = async () => {
  const pattern = (await import("./[pattern]/data/5-rect.txt?raw")).default
  return { pattern }
}
