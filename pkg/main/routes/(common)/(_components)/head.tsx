// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { Head as HeadFresh } from "$fresh/runtime.ts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/pkg/main/constants.ts";
import type { ComponentChildren } from "preact";
import Meta, { type MetaProps } from "./meta.tsx";

export type HeadProps =
  & Partial<Omit<MetaProps, "href">>
  & Pick<MetaProps, "href">
  & {
    children?: ComponentChildren;
  };

export const Head = (props: HeadProps) => {
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
};
