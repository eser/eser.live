// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import IconBrandYouTube from "tabler_icons_tsx/brand-youtube-filled.tsx";
import IconX from "tabler_icons_tsx/x.tsx";
import IconMenu from "tabler_icons_tsx/menu-2.tsx";
import { clsx } from "@/pkg/main/utils/clsx.ts";
import { Logo } from "@/pkg/main/components/logo.tsx";
import {
  ACTIVE_ANCESTOR_LINK_STYLES,
  ACTIVE_LINK_STYLES,
  LINK_STYLES,
  SITE_BAR_STYLES,
  SITE_NAME,
} from "@/pkg/main/utils/constants.ts";
import { User } from "@/pkg/main/utils/db.ts";

export interface HeaderProps {
  /** Currently logged-in user */
  sessionUser?: User;
  isEditor?: boolean;
  /**
   * URL of the current page. This is used for highlighting the currently
   * active page in navigation.
   */
  url: URL;
}

export default function Header(props: HeaderProps) {
  const NAV_ITEM = "text-slate-500 px-3 py-4 md:py-2";
  return (
    <header
      class={clsx(
        SITE_BAR_STYLES,
        "flex-col md:flex-row mt-4",
      )}
    >
      <input
        type="checkbox"
        id="nav-toggle"
        class="hidden [:checked&+*>:last-child>*>:first-child]:hidden [:checked&+*>:last-child>*>:last-child]:block checked:siblings:last-child:flex"
      />

      <div class="flex justify-between items-center">
        <a href="/" class="shrink-0">
          <Logo height={49} width={200} title={SITE_NAME + " logo"} />
        </a>
        <div class="flex gap-4 items-center">
          <label
            tabIndex={0}
            class="md:hidden"
            id="nav-toggle-label"
            htmlFor="nav-toggle"
          >
            <IconMenu class="w-6 h-6" />
            <IconX class="hidden w-6 h-6" />
          </label>
        </div>
      </div>
      <script>
        {`
          const navToggleLabel = document.getElementById('nav-toggle-label');
          navToggleLabel.addEventListener('keydown', () => {
            if (event.code === 'Space' || event.code === 'Enter') {
              navToggleLabel.click();
              event.preventDefault();
            }
          });
        `}
      </script>
      <nav
        class={"hidden flex-col gap-x-4 divide-y divide-solid md:flex md:items-center md:flex-row md:divide-y-0"}
      >
        <a
          href="/qa"
          class={clsx(
            LINK_STYLES,
            ACTIVE_LINK_STYLES,
            ACTIVE_ANCESTOR_LINK_STYLES,
            NAV_ITEM,
          )}
        >
          Soru / Yanıt
        </a>
        <a
          href="/blog"
          class={clsx(
            LINK_STYLES,
            ACTIVE_LINK_STYLES,
            ACTIVE_ANCESTOR_LINK_STYLES,
            NAV_ITEM,
          )}
        >
          Blog
        </a>
        {props.isEditor === true && (
          <a
            href="/manage"
            class={clsx(
              LINK_STYLES,
              ACTIVE_LINK_STYLES,
              ACTIVE_ANCESTOR_LINK_STYLES,
              NAV_ITEM,
            )}
          >
            Panel
          </a>
        )}
        {props.sessionUser
          ? (
            <a
              href="/account"
              class={clsx(
                LINK_STYLES,
                ACTIVE_LINK_STYLES,
                ACTIVE_ANCESTOR_LINK_STYLES,
                NAV_ITEM,
              )}
            >
              Hesap
            </a>
          )
          : (
            <a href="/auth/login" class={clsx(LINK_STYLES, NAV_ITEM)}>
              Giriş
            </a>
          )}
        <div class="rounded-lg bg-gradient-to-tr from-secondary to-primary p-px">
          <a
            href="https://www.youtube.com/@eserlive/live"
            class="flex flex-row gap-2 text-center text-white rounded-[7px] transition duration-300 px-4 py-2 hover:bg-white hover:text-slate-900 hover:dark:bg-gray-900 hover:dark:!text-slate-100"
          >
            <IconBrandYouTube class="h-6 w-6" />
            <span class="lg:hidden">Yayın</span>
            <span class="hidden lg:inline">YouTube Yayını</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
