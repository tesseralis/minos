import { mdsvex } from "mdsvex"
import adapter from "@sveltejs/adapter-netlify"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import rehypeKatexSvelte from "rehype-katex-svelte"
import remarkMath from "remark-math"

const config = {
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".md", ".svx"],
      remarkPlugins: [[remarkMath, { strict: false }]],
      rehypePlugins: [[rehypeKatexSvelte, { strict: false }]],
    }),
  ],
  kit: { adapter: adapter() },
  extensions: [".svelte", ".svx"],
  adapter: adapter(),
}

export default config
