// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { type User } from "@/pkg/main/services/users.ts";
import { GitHubAvatarImg } from "@/pkg/main/routes/(common)/(_components)/github-avatar-img.tsx";
import { fetchValues } from "@/pkg/main/library/http/fetch-values.ts";

const TH_STYLES = "p-4 text-left";
const TD_STYLES = "p-4";

function UserTableRow(props: User) {
  return (
    <tr class="hover:bg-gray-50 hover:dark:bg-gray-900 border-b border-gray-200">
      <td scope="col" class={TD_STYLES}>
        <GitHubAvatarImg login={props.login} size={32} />
        <a
          class="hover:underline ml-4 align-middle"
          href={`/dash/users/${props.login}`}
        >
          {props.login}
        </a>
      </td>
    </tr>
  );
}

export interface UsersTableProps {
  /** Endpoint URL of the REST API to make the fetch request to */
  endpoint: string;
}

export function UsersTable(props: UsersTableProps) {
  const usersSig = useSignal<User[]>([]);
  const cursorSig = useSignal("");
  const isLoadingSig = useSignal(false);

  async function loadMoreUsers() {
    if (isLoadingSig.value) {
      return;
    }

    isLoadingSig.value = true;

    try {
      const { items, cursor } = await fetchValues<User>(
        props.endpoint,
        cursorSig.value,
      );

      usersSig.value = [...usersSig.value, ...items];
      cursorSig.value = cursor;
    } catch (error) {
      console.log(error.message);
    } finally {
      isLoadingSig.value = false;
    }
  }

  useEffect(() => {
    loadMoreUsers();
  }, []);

  return (
    <div class="w-full rounded-lg shadow border-1 border-gray-300 overflow-x-auto">
      <table class="table-auto border-collapse w-full">
        <thead class="border-b border-gray-300">
          <tr>
            <th scope="col" class={TH_STYLES}>Kullanıcı</th>
          </tr>
        </thead>
        <tbody>
          {usersSig.value.map((user) => <UserTableRow {...user} />)}
        </tbody>
      </table>
      {cursorSig.value !== "" && (
        <button
          onClick={loadMoreUsers}
          class={"text-slate-500 transition duration-100 hover:text-black hover:dark:text-white p-4"}
        >
          {isLoadingSig.value ? "Ykleniyor..." : "Daha fazla gster"}
        </button>
      )}
    </div>
  );
}
