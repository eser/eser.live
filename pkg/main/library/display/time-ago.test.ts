// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import * as datetimeConstants from "@std/datetime/constants";
import { timeAgo } from "./time-ago.ts";

Deno.test("[display] timeAgo()", () => {
  assert.assertEquals(timeAgo(new Date(Date.now())), "şimdi");
  assert.assertEquals(
    timeAgo(new Date(Date.now() - datetimeConstants.SECOND * 30)),
    "30 saniye önce",
  );
  assert.assertEquals(
    timeAgo(new Date(Date.now() - datetimeConstants.MINUTE)),
    "1 dakika önce",
  );
  assert.assertEquals(
    timeAgo(new Date(Date.now() - datetimeConstants.MINUTE * 2)),
    "2 dakika önce",
  );
  assert.assertEquals(
    timeAgo(new Date(Date.now() - datetimeConstants.MINUTE * 59)),
    "59 dakika önce",
  );
  assert.assertEquals(
    timeAgo(new Date(Date.now() - datetimeConstants.HOUR)),
    "1 saat önce",
  );
  assert.assertEquals(
    timeAgo(
      new Date(
        Date.now() - datetimeConstants.HOUR - datetimeConstants.MINUTE * 35,
      ),
    ),
    "1 saat önce",
  );
  assert.assertEquals(
    timeAgo(new Date(Date.now() - datetimeConstants.HOUR * 2)),
    "2 saat önce",
  );
  assert.assertEquals(
    timeAgo(new Date(Date.now() - datetimeConstants.DAY)),
    "1 gün önce",
  );
  assert.assertEquals(
    timeAgo(
      new Date(
        Date.now() - datetimeConstants.DAY - datetimeConstants.HOUR * 12,
      ),
    ),
    "1 gün önce",
  );
  assert.assertEquals(
    timeAgo(new Date(Date.now() - datetimeConstants.DAY * 5)),
    "5 gün önce",
  );
  assert.assertThrows(
    () => timeAgo(new Date(Date.now() + 1)),
    Error,
    "Timestamp must be in the past",
  );
});
