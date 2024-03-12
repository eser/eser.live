// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import Header from "@/components/header.tsx";
import Footer from "@/components/footer.tsx";
import { type State } from "@/plugins/session.ts";
import { defineApp } from "$fresh/server.ts";

export default defineApp<State>((_, ctx) => {
  return (
    <div class="text-slate-600 dark:bg-gray-900">
      <div class="flex flex-col min-h-screen mx-auto max-w-7xl w-full dark:text-white">
        <Header
          url={ctx.url}
          sessionUser={ctx.state?.sessionUser}
          isEditor={ctx.state?.isEditor}
        />
        <ctx.Component />
        <Footer url={ctx.url} />
      </div>
    </div>
  );
});
