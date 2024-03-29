// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
export const SITE_NAME = "eser.live";
export const SITE_DESCRIPTION = "Eser Özvataf'ın kişisel YouTube kanalı";
export const SITE_LANG = "tr";
export const SITE_LOCALE = "tr";

/**
 * These are base styles for some elements. This approach is chosen as it avoids more complex alternatives:
 * 1. Writing custom classes in Tailwind CSS (see https://tailwindcss.com/docs/reusing-styles#compared-to-css-abstractions)
 * 2. Writing custom components which offer no additional functionality beyond styling
 */
export const BUTTON_STYLES =
  "px-4 py-2 bg-primary text-white rounded-lg border-1 border-primary transition duration-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-transparent hover:text-primary";
export const INPUT_STYLES =
  "px-4 py-2 rounded rounded-lg outline-none border-1 border-gray-300 hover:border-black transition duration-100 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:border-white";
export const SITE_BAR_STYLES = "flex justify-between p-4 gap-4";
export const NAV_STYLES =
  "flex flex-wrap justify-start gap-x-8 gap-y-4 items-center justify-between h-full";
export const LINK_STYLES =
  "text-slate-500 transition duration-100 hover:text-black hover:dark:text-white";
export const ACTIVE_LINK_STYLES =
  "[data-current]:!text-black [data-current]:!dark:text-white";
export const ACTIVE_ANCESTOR_LINK_STYLES =
  "[data-ancestor]:!text-black [data-ancestor]:!dark:text-white";
export const HEADING_STYLES = "text-3xl font-bold";
export const HEADING_WITH_MARGIN_STYLES = HEADING_STYLES + " mb-8";
