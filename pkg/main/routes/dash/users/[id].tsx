// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { userRepository } from "@/pkg/main/data/user/repository.ts";
import type { User } from "@/pkg/main/data/user/types.ts";
import { ensureParameterIsSpecified, type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { UserProfilePicture } from "@/pkg/main/routes/(common)/(_components)/user-profile-picture.tsx";
// import { QuestionsList } from "@/pkg/main/routes/(common)/(_islands)/questions-list.tsx";
import IconBrandGithub from "tabler_icons_tsx/brand-github-filled.tsx";

interface UserProfileProps {
  user: User;
}

const UserProfile = (props: UserProfileProps) => {
  return (
    <div class="flex flex-col items-center w-[16rem]">
      <UserProfilePicture user={props.user} isAnonymous={false} size={200} />
      <div class="flex gap-x-2 px-4 mt-4 items-center">
        <div class="font-semibold text-xl">{props.user.name}</div>
        <a
          href={`https://github.com/${props.user.githubHandle}`}
          aria-label={`${props.user.name}'s GitHub profile`}
          class="text-slate-500 transition duration-100 hover:text-black hover:dark:text-white"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandGithub class="w-6" />
        </a>
      </div>
    </div>
  );
};

export default defineRoute<State>(async (_req, ctx) => {
  const userId = ensureParameterIsSpecified("userId", ctx.params.id);
  const user = await userRepository.findById(userId);

  if (user === null) {
    return await ctx.renderNotFound();
  }

  const isLoggedIn = ctx.state.sessionUser !== null;
  // const isEditor = ctx.state.isEditor;
  const endpoint = `/api/users/${userId}/questions`;

  return (
    <>
      <Head title={`Kullanıcı: ${user!.name}`} href={ctx.url.href}>
        <link as="fetch" crossOrigin="anonymous" href={endpoint} rel="preload" />
        {isLoggedIn && <link as="fetch" crossOrigin="anonymous" href="/api/me/question-votes" rel="preload" />}
      </Head>
      <main>
        <div class="content-area">
          <div class="flex justify-center p-4">
            <UserProfile user={user} />
          </div>
          {/* <QuestionsList endpoint={endpoint} isLoggedIn={isLoggedIn} isEditor={isEditor} /> */}
        </div>
      </main>
    </>
  );
});
