import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: "./src/entry.tsx",
    },
    alias: {
      "@": "src/src",
    },
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
  },
});
      
