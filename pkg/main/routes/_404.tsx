// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type PageProps } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";

// deno-lint-ignore no-explicit-any
export const Error404Page = (_props: PageProps<any, State>) => {
  return (
    <main>
      <div class="content-area">
        <h1>Sayfa bulunamadı</h1>
        <p>
          <a href="/">Geri dön &#8250;</a>
        </p>
      </div>
    </main>
  );
};

export default Error404Page;
