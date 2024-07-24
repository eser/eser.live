// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as assert from "@std/assert";
import * as httpStatus from "@std/http/status";
import * as ulid from "@std/ulid";
import * as mock from "@std/testing/mock";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";
import { getGitHubUser } from "./github.ts";

Deno.test("[plugins] getGitHubUser()", async (test) => {
  await test.step("rejects on error message", async () => {
    const message = ulid.ulid();
    const fetchStub = mock.stub(
      globalThis,
      "fetch",
      mock.returnsNext([
        Promise.resolve(
          Response.json({ message }, {
            status: httpStatus.STATUS_CODE.BadRequest,
          }),
        ),
      ]),
    );
    await assert.assertRejects(
      async () => await getGitHubUser(ulid.ulid()),
      BadRequestError,
      message,
    );
    fetchStub.restore();
  });

  await test.step("resolves to a GitHub user object", async () => {
    const body = { login: ulid.ulid(), email: ulid.ulid() };
    const fetchStub = mock.stub(
      globalThis,
      "fetch",
      mock.returnsNext([Promise.resolve(Response.json(body))]),
    );
    assert.assertEquals(await getGitHubUser(ulid.ulid()), body);
    fetchStub.restore();
  });
});
