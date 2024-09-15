// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import tailwindCssTypography from "@tailwindcss/typography";
import daisyui from "daisyui";
import type { Config } from "tailwindcss";

const config: Config = {
  corePlugins: {
    preflight: false,
  },
  plugins: [
    tailwindCssTypography,
    // @ts-ignore missing type information
    daisyui,
  ],
  content: ["./{routes,islands,components}/**/*.{js,ts,jsx,tsx,mdx}"],
  daisyui: {
    themes: false,
    base: false,
    styled: true,
    utils: true,
    logs: false,
    themeRoot: ":root",
  },
  darkMode: [
    "variant",
    ["@media (prefers-color-scheme: dark) { &:not(.theme-variant-light *) }", "&:is(.theme-variant-dark *)"],
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
      "4xl": "2560px",
    },
    extend: {
      colors: {
        link: "oklch(var(--li) / <alpha-value>)",
        "link-hover": "oklch(var(--lih) / <alpha-value>)",
      },
      // fontFamily: {
      //   sans: ["var(--font-geist-sans)"],
      //   mono: ["var(--font-geist-mono)"],
      // },
    },
  },
};

export default config;
