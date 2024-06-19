// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { useEffect } from "preact/hooks";

const modKeys = ["Shift", "Control", "Alt", "Meta"];

function checkKeys(keys: string[], e: globalThis.KeyboardEvent) {
  for (const key of keys) {
    if (modKeys.includes(key)) {
      if (!e.getModifierState(key)) {
        return false;
      }

      continue;
    }

    if (e.key !== key) {
      return false;
    }
  }

  return true;
}

function useShortcut(keys: string[], actionHandler: () => void) {
  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (checkKeys(keys, e)) {
        e.preventDefault();
        actionHandler();
      }
    }

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
}

export function Shortcuts() {
  // TODO(@eser) Console with `

  useShortcut(["Meta", "1"], () => {
    document.documentElement.classList.toggle("debug");
  });

  useShortcut(["Meta", "2"], () => {
    const isLight =
      document.documentElement.classList.contains("theme-variant-light") ||
      (!document.documentElement.classList.contains("theme-variant-dark") &&
        !globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches);

    if (isLight) {
      document.documentElement.classList.remove("theme-variant-light");
      document.documentElement.classList.add("theme-variant-dark");
    } else {
      document.documentElement.classList.remove("theme-variant-dark");
      document.documentElement.classList.add("theme-variant-light");
    }
  });

  useShortcut(["Meta", "3"], () => {
    document.documentElement.classList.toggle("theme-default");
    document.documentElement.classList.remove("theme-variant-light");
    document.documentElement.classList.remove("theme-variant-dark");
  });

  return null;
}
