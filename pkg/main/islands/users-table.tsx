// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { type User } from "@/pkg/main/utils/db.ts";
import GitHubAvatarImg from "@/pkg/main/components/github-avatar-img.tsx";
import { LINK_STYLES } from "@/pkg/main/utils/constants.ts";
import { fetchValues } from "@/pkg/main/utils/http.ts";

const TH_STYLES = "p-4 text-left";
const TD_STYLES = "p-4";

function UserTableRow(props: User) {
  return (
    <tr class="hover:bg-gray-50 hover:dark:bg-gray-900 border-b border-gray-200">
      <td scope="col" class={TD_STYLES}>
        <GitHubAvatarImg login={props.login} size={32} />
        <a
          class="hover:underline ml-4 align-middle"
          href={"/users/" + props.login}
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

export default function UsersTable(props: UsersTableProps) {
  const usersSig = useSignal<User[]>([]);
  const cursorSig = useSignal("");
  const isLoadingSig = useSignal(false);

  async function loadMoreUsers() {
    if (isLoadingSig.value) {
      return;
    }

    isLoadingSig.value = true;

    try {
      const { values, cursor } = await fetchValues<User>(
        props.endpoint,
        cursorSig.value,
      );

      usersSig.value = [...usersSig.value, ...values];
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
          class={LINK_STYLES + " p-4"}
        >
          {isLoadingSig.value ? "Yükleniyor..." : "Daha fazla göster"}
        </button>
      )}
    </div>
  );
}
