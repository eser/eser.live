// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
export const isHttps = (url: string): boolean => {
  return url.startsWith("https://");
};
