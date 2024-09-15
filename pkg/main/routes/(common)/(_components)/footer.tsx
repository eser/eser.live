// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { SITE_NAME } from "@/pkg/main/constants.ts";
import IconBrandDiscord from "tabler_icons_tsx/brand-discord-filled.tsx";
import IconBrandTelegram from "tabler_icons_tsx/brand-telegram.tsx";
import IconBrandX from "tabler_icons_tsx/brand-x.tsx";
import { MadeWithCool } from "./made-with-cool.tsx";

export const Footer = () => {
  return (
    <footer class="footer py-4 text-base-content flex items-center">
      <aside class="flex flex-1 items-center">
        <MadeWithCool />
        <p class="hidden md:block">
          <span class="font-medium">{SITE_NAME}</span>'e&nbsp;
          <a href="https://github.com/eser/cool">cool lime</a>'la hayat verilmiştir.
        </p>
        <p class="block md:hidden">
          <a href="https://github.com/eser/cool">cool lime</a>
        </p>
      </aside>
      <nav class="grid-flow-col gap-4 pr-4">
        <a href="https://discord.eser.live/" target="_blank" aria-label="Discord'da eser.live" rel="noreferrer">
          <IconBrandDiscord class="h-6 w-6" />
        </a>
        <a href="https://t.me/eserlive" target="_blank" aria-label="Telegram'da eser.live" rel="noreferrer">
          <IconBrandTelegram class="h-6 w-6" />
        </a>
        <a href="https://x.com/eserozvataf" target="_blank" aria-label="X'de eser.live" rel="noreferrer">
          <IconBrandX class="h-6 w-6" />
        </a>
      </nav>
    </footer>
  );
};
