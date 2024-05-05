// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type PageProps } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";

// deno-lint-ignore no-explicit-any
export default function Error500Page(props: PageProps<any, State>) {
  return (
    <main>
      <div>
        <h1>Sunucu kaynaklı hata</h1>
        <p>500 internal error: {(props.error as Error).message}</p>
        <p>
          <a href="/">Geri dön &#8250;</a>
        </p>
      </div>
    </main>
  );
}
