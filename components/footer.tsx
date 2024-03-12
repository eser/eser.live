// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import {
  LINK_STYLES,
  NAV_STYLES,
  SITE_BAR_STYLES,
  SITE_NAME,
} from "@/utils/constants.ts";
import IconBrandDiscord from "tabler_icons_tsx/brand-discord-filled.tsx";
import IconBrandX from "tabler_icons_tsx/brand-x.tsx";
// import IconBrandGitHub from "tabler_icons_tsx/brand-github-filled.tsx";
// import IconBrandYouTube from "tabler_icons_tsx/brand-youtube-filled.tsx";
// import IconRss from "tabler_icons_tsx/rss.tsx";

function MadeWithCoolBadge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="63" height="37" fill="none">
      <title>Made with Cool</title>
      <path
        fill="#D0E94F"
        d="M40.16 10.75c3.144 7.674 0 11.8-2.66 14.075.65 2.275-1.94 2.744-2.925 1.625-2.897.999-8.783.967-13-3.25-2.275-2.275-.5-7.336 5.525-10.725 5.2-2.925 10.4-4.55 13.06-1.726z"
      />
      <path
        fill="#fff"
        stroke="#D0E94F"
        strokeWidth="0.65"
        d="M27.1 12.475c4.45-2.923 9.766-4.147 11.939-2.255 3.336 2.905-7.064 9.478-10.964 11.03-4.225 1.682-1.95 5.525-4.225 5.525-1.95 0-1.625-2.6-3.369-5.037-1.03-1.44 1.523-5.916 6.619-9.263z"
      />
      <path
        fill="#D0E94F"
        d="M36.547 10.702c3.02.813-.236 3.701-2.796 5.548-2.426 1.75-4.294 2.737-5.15 3.14-.238.112-1.051-1.464-1.051-.65 0 .27-.455 1.455-.608 1.512-.887.332-2.744.838-3.792.838-2.27 0-1.25-3.09 1.96-5.93.579-.512.96-.418 1.483-.418-.349-.503-.347-.597.262-1.006 2.708-1.819 6.095-3.034 7.533-3.262.238.009.532.228.532.408.267-.09 1.363-.252 1.627-.18z"
      />
      <path
        fill="#fff"
        d="M27.293 15.719c.64-.486 1.069-.657 1.364-1.642.368.078.547-.052.84-.456.21.303 1.076.395 1.594.456-.466.293-.688.553-.945 1.368-.951-.397-2.058-.196-2.853.274z"
      />
    </svg>
  );
}

export interface FooterProps {
  /**
   * URL of the current page. This is used for highlighting the currently
   * active page in navigation.
   */
  url: URL;
}

export default function Footer(_props: FooterProps) {
  return (
    <footer
      class={`${SITE_BAR_STYLES} flex-col md:flex-row mt-8`}
    >
      <div class="hidden md:flex flex-row items-center">
        <MadeWithCoolBadge />
        <p>
          <span class="font-bold">{SITE_NAME}</span>'e{" "}
          <a href="https://github.com/eser/cool">cool lime</a>'la hayat
          verilmiştir.
        </p>
      </div>
      <nav class={NAV_STYLES}>
        {
          /* <a
          href="/blog/feed"
          aria-label="eser.live Blog RSS Feed"
          class={LINK_STYLES}
        >
          <IconRss class="h-6 w-6" />
        </a> */
        }
        <a
          href="https://discord.gg/ckS4huSvEk"
          target="_blank"
          aria-label="Discord'da eser.live"
          class={LINK_STYLES}
        >
          <IconBrandDiscord class="h-6 w-6" />
        </a>
        {
          /* <a
          href="https://github.com/eser"
          target="_blank"
          aria-label="GitHub'da eser"
          class={LINK_STYLES}
        >
          <IconBrandGitHub class="h-6 w-6" />
        </a> */
        }
        {
          /* <a
          href="https://www.youtube.com/@eserlive"
          target="_blank"
          aria-label="YouTube'da eser.live"
          class={LINK_STYLES}
        >
          <IconBrandYouTube class="h-6 w-6" />
        </a> */
        }
        <a
          href="https://x.com/eserozvataf"
          target="_blank"
          aria-label="X'de eser.live"
          class={LINK_STYLES}
        >
          <IconBrandX class="h-6 w-6" />
        </a>
      </nav>
    </footer>
  );
}
