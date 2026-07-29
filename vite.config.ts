import { svelteTesting } from "@testing-library/svelte/vite"
import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import "vitest/config"
import Icons from "unplugin-icons/vite"
// import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: "svelte",
    }),
    // visualizer({
    //   emitFile: true,
    //   filename: "stats.html",
    // }),
  ],
  build: {
    rollupOptions: {
      output: {
        codeSplitting: {
          groups: [
            // The `mino` directory contains a lot of recursive references,
            // and needs to be bundled together to work.
            {
              test: /src\/lib\/mino/,
              name: "mino",
            },
          ],
        },
      },
    },
  },
  test: {
    projects: [
      {
        extends: "./vite.config.ts",
        plugins: [svelteTesting()],
        test: {
          name: "client",
          environment: "jsdom",
          clearMocks: true,
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
          setupFiles: ["./vitest-setup-client.ts"],
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
        },
      },
    ],
  },
})
