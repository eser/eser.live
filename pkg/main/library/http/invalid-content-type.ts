// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as httpStatus from "@std/http/status";
import { HttpError } from "./http-error.ts";

export class InvalidContentTypeError extends HttpError {
  constructor(accepts: string[], message?: string) {
    super(
      httpStatus.STATUS_CODE.UnsupportedMediaType,
      message ?? `Unable to serve content. Please use a client accepting one of: ${accepts.join(", ")}`,
    );
    this.name = "InvalidContentTypeError";
  }
}
