// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { User } from "@/pkg/main/data/user/types.ts";
import IconBrandYouTube from "tabler_icons_tsx/brand-youtube-filled.tsx";

const MenuItems = () => {
  return (
    <>
      {
        /* <li>
        <a href="/">~/</a>
      </li> */
      }
      {/* <li>
        <a href="/profiles" class="include-ancestors">
          Profiller
        </a>
      </li> */}
      <li>
        <a href="/news" class="include-ancestors">
          Haberler
        </a>
      </li>
      <li>
        <a href="/articles" class="include-ancestors">
          Makaleler
        </a>
      </li>
      <li>
        <a href="/videos" class="include-ancestors">
          Videolar
        </a>
      </li>
      <li>
        <a href="/projects" class="include-ancestors">
          Projeler
        </a>
      </li>
      <li>
        <a href="/events" class="include-ancestors">
          Etkinlikler
        </a>
      </li>
      <li>
        <a href="/qa" class="include-ancestors">
          Soru / Yanıt
        </a>
      </li>
      {
        /* <li>
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
    </>
  );
};

export type HeaderProps = {
  /** Currently logged-in user */
  sessionUser: User | null;
  /**
   * URL of the current page. This is used for highlighting the currently
   * active page in navigation.
   */
  url: URL;
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <MenuItems />
            </ul>
          </div>
          <a href="/" class="btn btn-ghost title">
            eser.live
          </a>
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
          <a href="https://www.youtube.com/@eserlive/live" class="btn btn-sm md:btn-md btn-error" target="_blank" rel="noreferrer">
            <IconBrandYouTube class="h-6 w-6" />
            <span class="inline md:hidden">Canlı</span>
            <span class="hidden md:inline">Canlı Yayın</span>
          </a>
          {props.sessionUser !== null
            ? (
              <div class="dropdown dropdown-end">
                <div tabIndex={0} role="button" class="btn btn-ghost btn-circle avatar">
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
              <a href="/auth/login" tabIndex={0} role="button" class="btn btn-sm md:btn-md btn-neutral">
                <span class="inline md:hidden">Giriş</span>
                <span class="hidden md:inline">GitHub ile Giriş</span>
              </a>
            )}
        </div>
      </div>
    </header>
  );
};
