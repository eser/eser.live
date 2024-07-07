// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type MixTypes, toVal } from "./to-val.ts";

export const clsx = (...args: Array<MixTypes>) => {
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
};
