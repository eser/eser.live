// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import * as ulid from "@std/ulid";
import * as mock from "@std/testing/mock";
import { STATUS_CODE } from "$fresh/server.ts";
import {
  type Question,
  randomQuestion,
} from "@/pkg/main/services/questions.ts";
import { fetchValues } from "./fetch-values.ts";

Deno.test("[http] fetchValues()", async () => {
  const resp1 = Promise.resolve(
    new Response(null, { status: STATUS_CODE.NotFound }),
  );
  const resp2Body = {
    items: [randomQuestion(), randomQuestion()],
    cursor: ulid.ulid(),
  };
  const resp2Cursor = ulid.ulid();
  const resp2 = Promise.resolve(Response.json(resp2Body));
  const fetchStub = mock.stub(
    globalThis,
    "fetch",
    mock.returnsNext([resp1, resp2]),
  );
  const endpoint = "http://localhost";
  await assert.assertRejects(
    async () => await fetchValues(endpoint, ""),
    Error,
    `Request failed: GET ${endpoint}`,
  );
  assert.assertEquals(
    await fetchValues<Question>(endpoint + "/api/questions", resp2Cursor),
    resp2Body,
  );

  fetchStub.restore();
});
