// Copyright 2024-present the Deno authors. All rights reserved. MIT license.

export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "BadRequestError";
  }
}
