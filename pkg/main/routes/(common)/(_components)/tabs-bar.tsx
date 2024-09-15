// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { clsx } from "@/pkg/main/library/display/clsx.ts";
import type { ComponentChildren } from "preact";

export interface TabItemProps {
  /** Path of the item's URL */
  path: string;
  /** Whether the user is on the item's URL */
  active: boolean;
  children?: ComponentChildren;
}

export const TabItem = (props: TabItemProps) => {
  return (
    <a role="tab" href={props.path} class={clsx("tab", props.active ? "tab-active" : "")}>
      {props.children}
    </a>
  );
};

export interface TabsBarProps {
  links: {
    path: string;
    innerText: string;
    isVisible: boolean;
  }[];
  currentPath: string;
}

export const TabsBar = (props: TabsBarProps) => {
  return (
    <div role="tablist" class="tabs tabs-lifted">
      {props.links
        .filter((link) => link.isVisible)
        .map((link) => (
          <TabItem path={link.path} active={link.path === props.currentPath}>
            {link.innerText}
          </TabItem>
        ))}
    </div>
  );
};
