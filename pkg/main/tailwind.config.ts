// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type Config } from "tailwindcss";

export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(.theme-variant-light *) }",
      "&:is(.theme-variant-dark *)",
    ],
  ],
  theme: {
    screens: {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
      "4xl": "2560px",
    },
  },
} satisfies Config;
