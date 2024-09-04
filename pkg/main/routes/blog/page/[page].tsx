// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import BlogIndex from "../index.tsx";

export default defineRoute<State>(BlogIndex);
