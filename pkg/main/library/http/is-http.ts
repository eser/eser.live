// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
export function isHttps(url: string): boolean {
  return url.startsWith("https://");
}
