// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type User } from "@/pkg/main/data/models/user.ts";

export interface UserProfileLinkProps {
  user: Pick<User, "id" | "name" | "githubHandle"> | undefined;
  isAnonymous?: boolean;
  class?: string;
}

export const UserProfileLink = (props: UserProfileLinkProps) => {
  if (props.isAnonymous === true || props.user === undefined) {
    return (
      <>
        anonim
      </>
    );
  }

  const name = (props.user.name.length > 0)
    ? props.user.name
    : props.user.githubHandle;

  return (
    <a
      href={`/dash/users/${props.user.id}`}
      class={props.class}
    >
      {name}
    </a>
  );
};
