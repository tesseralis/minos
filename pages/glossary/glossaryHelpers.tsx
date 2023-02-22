import fs from "fs"

export function getTerms() {
  return fs
    .readdirSync(`${process.cwd()}/pages/glossary/subpages`)
    .map((term) => term.replace(".mdx", ""))
}
