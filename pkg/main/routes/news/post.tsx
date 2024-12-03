// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { useSignal } from "@preact/signals";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { storyRepository } from "@/pkg/main/data/story/repository.ts";
import { ensureMediaTypes, type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";

type HandlerResult = {
  success?: boolean;
  error?: string;
};

export const handler: Handlers<HandlerResult, State> = {
  async POST(req, ctx) {
    ensureMediaTypes(req, ["application/json", "text/html"]);

    const form = await req.formData();
    // const title = form.get("title") as string;
    // const content = form.get("content") as string;

    try {
      // await storyRepository.create({
      //   kind: "news",
      //   status: "published",
      //   title,
      //   content,
      //   // Add other necessary fields
      // });

      return new Response("", {
        status: 303,
        headers: { Location: "/news/" },
      });
    } catch (error) {
      return ctx.render({ error: error.message });
    }
  },
};

export default function NewNewsPage(props: PageProps<HandlerResult, State>) {
  const titleSignal = useSignal("");
  const contentSignal = useSignal("");

  return (
    <>
      <Head title="Yeni Haber" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1 class="text-2xl font-bold mb-4">
            <a href="/news/" class="link link-primary">Haberler</a> / Yeni Haber
          </h1>
          {props.data?.error && <div class="alert alert-error mb-4">{props.data.error}</div>}
          <form method="POST" class="form-control w-full max-w-lg">
            <label class="label">
              <span class="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={titleSignal.value}
              onInput={(e) => titleSignal.value = e.currentTarget.value}
              class="input input-bordered input-primary w-full"
              required={true}
            />
            <label class="label mt-4">
              <span class="label-text">Content</span>
            </label>
            <textarea
              name="content"
              value={contentSignal.value}
              onInput={(e) => contentSignal.value = e.currentTarget.value}
              class="textarea textarea-bordered textarea-primary h-32 w-full"
              required={true}
            >
            </textarea>
            <button type="submit" class="btn btn-primary mt-6">Submit</button>
          </form>
        </div>
      </main>
    </>
  );
}
