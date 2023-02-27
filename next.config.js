const remarkMath = require("remark-math")
const rehypeKatex = require("rehype-katex")

const withMDX = require("@next/mdx")({
  extension: /\.mdx$/,
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
})

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

module.exports = withBundleAnalyzer(
  withMDX({
    pageExtensions: ["page.ts", "page.tsx"],
    // target: "serverless",
  }),
)
