#!/usr/bin/env -S deno run -A --watch=static/,routes/
// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import dev from "$fresh/dev.ts";
import config from "@/pkg/main/fresh.config.ts";

await dev(import.meta.url, "./main.ts", config);
