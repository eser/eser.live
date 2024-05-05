// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import IconBrandDiscord from "tabler_icons_tsx/brand-discord-filled.tsx";
import IconBrandX from "tabler_icons_tsx/brand-x.tsx";
import { SITE_NAME } from "@/pkg/main/utils/constants.ts";
import { MadeWithCool } from "./made-with-cool.tsx";

export function Footer() {
  return (
    <footer>
      <div>
        <nav class="bottom-navigation navigation-strip tight">
          <ul>
            <li class="signature">
              <p>
                <MadeWithCool />
                <span class="font-medium">{SITE_NAME}</span>'e
                {"&nbsp;"}
                <a href="https://github.com/eser/cool">cool lime</a>'la hayat
                verilmiştir.
              </p>
            </li>
            <li>
              <a
                href="https://discord.gg/ckS4huSvEk"
                target="_blank"
                aria-label="Discord'da eser.live"
              >
                <IconBrandDiscord class="h-6 w-6" />
              </a>
            </li>
            <li>
              <a
                href="https://x.com/eserozvataf"
                target="_blank"
                aria-label="X'de eser.live"
              >
                <IconBrandX class="h-6 w-6" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
