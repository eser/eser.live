// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import IconBrandGithub from "tabler_icons_tsx/brand-github-filled.tsx";
import { defineRoute } from "$fresh/server.ts";
import {
  type User,
  userRepository,
} from "@/pkg/main/data/repositories/users.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { UserProfilePicture } from "@/pkg/main/routes/(common)/(_components)/user-profile-picture.tsx";
import { QuestionsList } from "@/pkg/main/routes/(common)/(_islands)/questions-list.tsx";

interface UserProfileProps {
  user: User;
}

function UserProfile(props: UserProfileProps) {
  return (
    <div class="flex flex-col items-center w-[16rem]">
      <UserProfilePicture user={props.user} size={200} />
      <div class="flex gap-x-2 px-4 mt-4 items-center">
        <div class="font-semibold text-xl">
          {props.user.name}
        </div>
        <a
          href={`https://github.com/${props.user.githubHandle}`}
          aria-label={`${props.user.name}'s GitHub profile`}
          class="text-slate-500 transition duration-100 hover:text-black hover:dark:text-white"
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
    const user = await userRepository.findById(login);

    if (user === undefined) {
      return await ctx.renderNotFound();
    }

    const isLoggedIn = ctx.state.sessionUser !== undefined;
    const endpoint = `/api/users/${login}/questions`;

    return (
      <>
        <Head title={`Kullanıcı: ${user!.name}`} href={ctx.url.href}>
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
        <main>
          <div class="content-area">
            <div class="flex justify-center p-4">
              <UserProfile user={user} />
            </div>
            <QuestionsList
              endpoint={endpoint}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </main>
      </>
    );
  },
);
