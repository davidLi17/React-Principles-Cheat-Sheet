/*
 * @Author: lihaoge lihaoge@bytedance.com
 * @Date: 2025-11-26
 * @Description: 配置tailwindcss
 */
import type { Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // single component styles

    "./node_modules/@nextui-org/theme/dist/components/**/*.js",
  ],
  darkMode: ["class", '[class~="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#a78bfa",
      },
    },
  },
  plugins: [nextui()],
} satisfies Config;
