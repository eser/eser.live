// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
export const isHttps = (url: string): boolean => {
  return url.startsWith("https://");
};
