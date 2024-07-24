// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
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
