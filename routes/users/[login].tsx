// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import IconBrandGithub from "tabler_icons_tsx/brand-github-filled.tsx";
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/plugins/session.ts";
import Head from "@/components/head.tsx";
import GitHubAvatarImg from "@/components/github-avatar-img.tsx";
import QuestionsList from "@/islands/questions-list.tsx";
import { getUser } from "@/utils/db.ts";
import { LINK_STYLES } from "@/utils/constants.ts";

interface UserProfileProps {
  login: string;
}

function UserProfile(props: UserProfileProps) {
  return (
    <div class="flex flex-col items-center w-[16rem]">
      <GitHubAvatarImg login={props.login} size={200} />
      <div class="flex gap-x-2 px-4 mt-4 items-center">
        <div class="font-semibold text-xl">
          {props.login}
        </div>
        <a
          href={`https://github.com/${props.login}`}
          aria-label={`${props.login}'s GitHub profile`}
          class={LINK_STYLES}
          target="_blank"
        >
          <IconBrandGithub class="w-6" />
        </a>
      </div>
    </div>
  );
}

export default defineRoute<State>(
  async (_req, ctx) => {
    const { login } = ctx.params;
    const user = await getUser(login);
    if (user === null) return await ctx.renderNotFound();

    const isLoggedIn = ctx.state.sessionUser !== undefined;
    const endpoint = `/api/users/${login}/questions`;

    return (
      <>
        <Head title={`Kullanıcı: ${user.login}`} href={ctx.url.href}>
          <link
            as="fetch"
            crossOrigin="anonymous"
            href={endpoint}
            rel="preload"
          />
          {isLoggedIn && (
            <link
              as="fetch"
              crossOrigin="anonymous"
              href="/api/me/question-votes"
              rel="preload"
            />
          )}
        </Head>
        <main class="flex-1 p-4 flex flex-col md:flex-row gap-8">
          <div class="flex justify-center p-4">
            <UserProfile {...user} />
          </div>
          <QuestionsList
            endpoint={endpoint}
            isLoggedIn={isLoggedIn}
          />
        </main>
      </>
    );
  },
);
