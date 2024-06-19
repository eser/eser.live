#!/usr/bin/env -S deno run -A --watch=static/,routes/
// Copyright 2024-present the Deno authors. All rights reserved. MIT license.

import dev from "$fresh/dev.ts";
import config from "@/pkg/main/fresh.config.ts";

await dev(import.meta.url, "./main.ts", config);
