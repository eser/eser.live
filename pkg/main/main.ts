// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "@std/dotenv/load";

import { start } from "$fresh/server.ts";
import config from "@/pkg/main/fresh.config.ts";
import manifest from "@/pkg/main/fresh.gen.ts";

await start(manifest, config);
