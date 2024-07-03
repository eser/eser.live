// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type User } from "@/pkg/main/data/models/user.ts";

export interface UserProfileLinkProps {
  user: Pick<User, "id" | "name" | "githubHandle"> | undefined;
  class?: string;
}

export function UserProfileLink(props: UserProfileLinkProps) {
  if (props.user === undefined) {
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
}
