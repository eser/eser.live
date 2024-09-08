// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as httpStatus from "@std/http/status";
import { HttpError } from "./http-error.ts";

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(httpStatus.STATUS_CODE.Unauthorized, message);
    this.name = "UnauthorizedError";
  }
}
