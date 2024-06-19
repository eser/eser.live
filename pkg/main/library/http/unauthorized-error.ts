// Copyright 2024-present the Deno authors. All rights reserved. MIT license.

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
