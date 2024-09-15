// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { useEffect } from "preact/hooks";

const modKeys = ["Shift", "Control", "Alt", "Meta"];

const checkKeys = (keys: string[], e: globalThis.KeyboardEvent) => {
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
};

const useShortcut = (keys: string[], actionHandler: () => void) => {
  useEffect(() => {
    const keyDownHandler = (e: globalThis.KeyboardEvent) => {
      if (checkKeys(keys, e)) {
        e.preventDefault();
        actionHandler();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
};

export const Shortcuts = () => {
  // TODO(@eser) Console with `

  useShortcut(["Meta", "1"], () => {
    document.documentElement.classList.toggle("debug");
  });

  useShortcut(["Meta", "2"], () => {
    const isLight = document.documentElement.classList.contains("theme-variant-light") ||
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
};
