// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
export type MixTypes = boolean | string | number | object | null;

export function toVal(mix: MixTypes) {
  let k, y;

  if (mix === false || mix === null || mix === undefined) {
    return "";
  }

  if (typeof mix === "string" || typeof mix === "number") {
    return mix;
  }

  if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      let str = "";

      for (k = 0; k < mix.length; k++) {
        if (mix[k] === null) {
          continue;
        }

        // deno-lint-ignore no-cond-assign
        if (y = toVal(mix[k])) {
          str && (str += " ");
          str += y;
        }
      }

      return str;
    }

    let str = "";
    for (k in mix) {
      if ((mix as Record<typeof k, unknown>)[k] === null) {
        continue;
      }

      str && (str += " ");
      str += k;
    }

    return str;
  }

  return "";
}
