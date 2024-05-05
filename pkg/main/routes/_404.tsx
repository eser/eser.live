// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type PageProps } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";

// deno-lint-ignore no-explicit-any
export default function Error404Page(_props: PageProps<any, State>) {
  return (
    <main>
      <div>
        <h1>Sayfa bulunamadı</h1>
        <p>
          <a href="/">Geri dön &#8250;</a>
        </p>
      </div>
    </main>
  );
}
