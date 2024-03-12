// Copyright 2023-present the Deno authors. All rights reserved. MIT license.

type MixTypes = boolean | string | number | object | null;

function toVal(mix: MixTypes) {
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

export function clsx(...args: Array<MixTypes>) {
  let i = 0, tmp, x, str = "";
  while (i < args.length) {
    // deno-lint-ignore no-cond-assign
    if (tmp = args[i++]) {
      // deno-lint-ignore no-cond-assign
      if (x = toVal(tmp)) {
        str && (str += " ");
        str += x;
      }
    }
  }

  return str;
}

export default clsx;
