// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
// import { Logo } from "@/pkg/main/routes/(common)/(_components)/logo.tsx";
// import {
//   SITE_NAME,
// } from "@/pkg/main/constants.ts";
import { type User } from "@/pkg/main/data/models/user.ts";
// import IconSearch from "tabler_icons_tsx/search.tsx";
import IconBrandYouTube from "tabler_icons_tsx/brand-youtube-filled.tsx";
// import IconMenu from "tabler_icons_tsx/menu-2.tsx";
// import IconX from "tabler_icons_tsx/x.tsx";

export interface HeaderProps {
  /** Currently logged-in user */
  sessionUser?: User;
  /**
   * URL of the current page. This is used for highlighting the currently
   * active page in navigation.
   */
  url: URL;
}

const MenuItems = () => {
  return (
    <>
      <li>
        <a href="/">
          ~/
        </a>
      </li>
      <li>
        <a href="/blog" class="include-ancestors">
          Blog
        </a>
      </li>
      <li>
        <a href="/qa" class="include-ancestors">
          Soru / Yanıt
        </a>
      </li>
      {
        /* <li>
        <a href="/projects" class="include-ancestors">
          Projeler
        </a>
      </li>
      <li>
        <a href="/cookbook" class="include-ancestors">
          Cookbook
        </a>
      </li>
      <li>
        <a href="/setup" class="include-ancestors">
          Setup
        </a>
      </li>
      <li>
        <a href="/community" class="include-ancestors">
          Topluluk
        </a>
      </li> */
      }
      {
        /* <li>
              <details>
                <summary>Parent</summary>
                <ul class="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </details>
            </li> */
      }
    </>
  );
};

export const Header = (props: HeaderProps) => {
  // const NAV_ITEM = "text-slate-500 px-3 py-4 md:py-2";
  return (
    <header>
      <div class="navbar">
        <div class="navbar-left">
          <div class="dropdown">
            <div tabIndex={0} role="button" class="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <MenuItems />
            </ul>
          </div>
          <a href="/" class="btn btn-ghost title">eser.live</a>
          <ul class="menu menu-horizontal px-1 m-0 hidden lg:flex">
            <MenuItems />
          </ul>
        </div>
        <div class="navbar-right">
          {
            /* Cart
          <div class="dropdown dropdown-end">
            <div tabIndex={0} role="button" class="btn btn-ghost btn-circle">
              <div class="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span class="badge badge-sm indicator-item">8</span>
              </div>
            </div>
            <div
              tabIndex={0}
              class="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
            >
              <div class="card-body">
                <span class="font-bold text-lg">8 Items</span>
                <span class="text-info">Subtotal: $999</span>
                <div class="card-actions">
                  <button class="btn btn-primary btn-block">View cart</button>
                </div>
              </div>
            </div>
          </div> */
          }
          <a
            href="https://www.youtube.com/@eserlive/live"
            class="btn btn-error"
            target="_blank"
          >
            <IconBrandYouTube class="h-6 w-6" />
            Canlı Yayın
          </a>
          {props.sessionUser !== undefined
            ? (
              <div class="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  class="btn btn-ghost btn-circle avatar"
                >
                  <div class="w-10 rounded-full">
                    <img
                      alt={`${props.sessionUser.name} profile picture`}
                      src={`https://github.com/${props.sessionUser.githubHandle}.png?size=200`}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a href="/dash" class="justify-between">
                      Hesap Ayarları
                      <span class="badge">•</span>
                    </a>
                  </li>
                  <li>
                    <a href="/auth/logout">Çıkış</a>
                  </li>
                </ul>
              </div>
            )
            : (
              <a
                href="/auth/login"
                tabIndex={0}
                role="button"
                class="btn btn-neutral"
              >
                GitHub Login
              </a>
            )}
        </div>
      </div>

      {
        /* <div>
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
          >
            Soru / Yanıt
          </a>
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
      </div> */
      }
    </header>
  );
};
