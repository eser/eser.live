// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import type * as httpStatus from "@std/http/status";

export class HttpError extends Error {
  status: httpStatus.StatusCode;

  constructor(status: httpStatus.StatusCode, message?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
