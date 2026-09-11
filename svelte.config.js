import { mdsvex } from "mdsvex"
import adapter from "@sveltejs/adapter-netlify"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import rehypeKatexSvelte from "rehype-katex-svelte"
import remarkMath from "remark-math"
import remarkFootnotes from "remark-footnotes"

const config = {
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".md", ".svx"],
      remarkPlugins: [
        // this is a deprecated module, but required: https://github.com/pngwn/MDsveX/discussions/223#discussioncomment-541337
        remarkFootnotes,
        [remarkMath, { strict: false }],
      ],
      rehypePlugins: [[rehypeKatexSvelte, { strict: false }]],
    }),
  ],
  kit: { adapter: adapter() },
  extensions: [".svelte", ".svx"],
  adapter: adapter(),
}

export default config
