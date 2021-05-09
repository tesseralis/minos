const withMDX = require("@next/mdx")()

module.exports = withMDX({
  pageExtensions: ["page.ts", "page.tsx"],
  future: {
    webpack5: true,
  },
  target: "serverless",
})
