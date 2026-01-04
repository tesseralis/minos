export const load = async ({ params }) => {
  const { pattern: patternName } = params
  const pattern = (await import(`./data/${patternName}.txt?raw`)).default
  return { pattern: pattern, patternName }
}
