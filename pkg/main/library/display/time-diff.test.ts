// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import * as datetimeConstants from "@std/datetime/constants";
import { timeDiff } from "./time-diff.ts";

Deno.test("[display] timeDiff()", () => {
  assert.assertEquals(timeDiff(new Date(Date.now())), "şimdi");

  assert.assertEquals(
    timeDiff(new Date(Date.now() - datetimeConstants.SECOND * 30)),
    "30 saniye önce",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() - datetimeConstants.MINUTE)),
    "1 dakika önce",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() - datetimeConstants.MINUTE * 2)),
    "2 dakika önce",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() - datetimeConstants.MINUTE * 59)),
    "59 dakika önce",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() - datetimeConstants.HOUR)),
    "1 saat önce",
  );
  assert.assertEquals(
    timeDiff(
      new Date(
        Date.now() - datetimeConstants.HOUR - datetimeConstants.MINUTE * 35,
      ),
    ),
    "1 saat önce",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() - datetimeConstants.HOUR * 2)),
    "2 saat önce",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() - datetimeConstants.DAY)),
    "1 gün önce",
  );
  assert.assertEquals(
    timeDiff(
      new Date(
        Date.now() - datetimeConstants.DAY - datetimeConstants.HOUR * 12,
      ),
    ),
    "1 gün önce",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() - datetimeConstants.DAY * 5)),
    "5 gün önce",
  );

  assert.assertEquals(
    timeDiff(new Date(Date.now() + datetimeConstants.SECOND * 30)),
    "30 saniye sonra",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() + datetimeConstants.MINUTE)),
    "1 dakika sonra",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() + datetimeConstants.MINUTE * 2)),
    "2 dakika sonra",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() + datetimeConstants.MINUTE * 59)),
    "59 dakika sonra",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() + datetimeConstants.HOUR)),
    "1 saat sonra",
  );
  assert.assertEquals(
    timeDiff(
      new Date(
        Date.now() + datetimeConstants.HOUR + datetimeConstants.MINUTE * 35,
      ),
    ),
    "1 saat sonra",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() + datetimeConstants.HOUR * 2)),
    "2 saat sonra",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() + datetimeConstants.DAY)),
    "1 gün sonra",
  );
  assert.assertEquals(
    timeDiff(
      new Date(
        Date.now() + datetimeConstants.DAY + datetimeConstants.HOUR * 12,
      ),
    ),
    "1 gün sonra",
  );
  assert.assertEquals(
    timeDiff(new Date(Date.now() + datetimeConstants.DAY * 5)),
    "5 gün sonra",
  );
});
