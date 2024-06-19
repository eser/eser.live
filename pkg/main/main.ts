// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import fromAsync from "../polyfills/array-from-async.js";
if (Array.fromAsync === undefined) {
  Array.fromAsync = fromAsync;
}

import { start } from "$fresh/server.ts";
import manifest from "@/pkg/main/fresh.gen.ts";
import config from "@/pkg/main/fresh.config.ts";

await start(manifest, config);
