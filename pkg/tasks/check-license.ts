// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
// Copied from std/_tools/check_license.ts

import { walk } from "std/fs/walk.ts";

const EXTENSIONS = [".ts", ".tsx"];
const EXCLUDED_PATTERNS = [
  /node_modules\/*$/,
  /_fresh\/*$/,
  /test\/coverage\/*$/,
  /content\/*$/,
  /temp\/*$/,
  /static\/*$/,
  /pkg\/old\-/,
  /fresh.gen.ts/,
];

const ROOT = new URL("../../", import.meta.url);
const CHECK = Deno.args.includes("--check");
const BASE_YEAR = "2024";
// const CURRENT_YEAR = new Date().getFullYear();
const RX_COPYRIGHT = new RegExp(
  `// Copyright ([0-9]{4})-present the Deno authors\\. All rights reserved\\. MIT license\\.\n`,
);
const COPYRIGHT =
  `// Copyright ${BASE_YEAR}-present the Deno authors. All rights reserved. MIT license.`;

let failed = false;

for await (
  const { path } of walk(ROOT, {
    exts: EXTENSIONS,
    skip: EXCLUDED_PATTERNS,
    includeDirs: false,
  })
) {
  const content = await Deno.readTextFile(path);
  const match = content.match(RX_COPYRIGHT);

  if (!match) {
    if (CHECK) {
      console.error(`Missing copyright header: ${path}`);
      failed = true;
    } else {
      const contentWithCopyright = COPYRIGHT + "\n" + content;
      await Deno.writeTextFile(path, contentWithCopyright);
      console.log("Copyright header automatically added to " + path);
    }
  } else if (match[1] !== BASE_YEAR) {
    if (CHECK) {
      console.error(`Incorrect copyright year: ${path}`);
      failed = true;
    } else {
      const index = match.index ?? 0;
      const contentWithoutCopyright = content.replace(match[0], "");
      const contentWithCopyright = contentWithoutCopyright.substring(0, index) +
        COPYRIGHT + "\n" + contentWithoutCopyright.substring(index);
      await Deno.writeTextFile(path, contentWithCopyright);
      console.log("Copyright header automatically updated in " + path);
    }
  }
}

if (failed) {
  console.info(`Copyright header should be "${COPYRIGHT}"`);
  Deno.exit(1);
}
