// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { Head as HeadFresh } from "$fresh/runtime.ts";
import Meta, { type MetaProps } from "./meta.tsx";
import { SITE_DESCRIPTION, SITE_NAME } from "@/pkg/main/constants.ts";
import { type ComponentChildren } from "preact";

export type HeadProps =
  & Partial<Omit<MetaProps, "href">>
  & Pick<MetaProps, "href">
  & {
    children?: ComponentChildren;
  };

export function Head(props: HeadProps) {
  return (
    <HeadFresh>
      <Meta
        title={props?.title ? `${props.title} ▲ ${SITE_NAME}` : SITE_NAME}
        description={props?.description ?? SITE_DESCRIPTION}
        href={props.href}
        imageUrl="/cover.png"
      />
      {props.children}
    </HeadFresh>
  );
}
