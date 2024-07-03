// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type User } from "@/pkg/main/data/models/user.ts";

export interface UserProfilePictureProps {
  user: Pick<User, "githubHandle"> | undefined;
  size: number;
  class?: string;
}

export function UserProfilePicture(props: UserProfilePictureProps) {
  const login = props.user?.githubHandle ?? "octocat";

  return (
    <img
      height={props.size}
      width={props.size}
      // Intrinsic size is 2x rendered size for Retina displays
      src={`https://avatars.githubusercontent.com/${login}?s=${props.size * 2}`}
      alt={`GitHub avatar of ${login}`}
      class={`rounded-full inline-block aspect-square h-[${props.size}px] w-[${props.size}px] ${
        props.class ?? ""
      }`}
      crossOrigin="anonymous"
      loading="lazy"
    />
  );
}
