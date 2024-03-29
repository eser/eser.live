// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type PageProps } from "$fresh/server.ts";
import { HEADING_STYLES, LINK_STYLES } from "@/pkg/main/utils/constants.ts";

export default function Error500Page(props: PageProps) {
  return (
    <main class="flex flex-1 flex-col justify-center p-4 text-center space-y-4">
      <h1 class={HEADING_STYLES}>Sunucu kaynaklı hata</h1>
      <p>500 internal error: {(props.error as Error).message}</p>
      <p>
        <a href="/" class={LINK_STYLES}>Geri dön &#8250;</a>
      </p>
    </main>
  );
}
