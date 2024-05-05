// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import IconShare from "tabler_icons_tsx/share.tsx";
import IconBrandWhatsApp from "tabler_icons_tsx/brand-whatsapp.tsx";
import IconBrandTelegram from "tabler_icons_tsx/brand-telegram.tsx";
import IconBrandLinkedin from "tabler_icons_tsx/brand-linkedin.tsx";
import IconBrandReddit from "tabler_icons_tsx/brand-reddit.tsx";
import IconBrandX from "tabler_icons_tsx/brand-x.tsx";

/**
 * Dynamically generates links for sharing the current content on the major
 * social media platforms.
 *
 * @see {@link https://schier.co/blog/pure-html-share-buttons}
 */
export function Share(props: { url: string; title: string }) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    if (navigator.share) {
      navigator.share({
        title: props.title,
        url: props.url,
        text: props.url,
      });
    }
  };

  return (
    <div class="flex flex-row gap-4 my-4">
      <span class="align-middle">Paylaş</span>
      <a
        href={props.url}
        aria-label={`Share ${props.title}`}
        onClick={handleClick}
      >
        <IconShare />
      </a>
      <a
        href={`https://web.whatsapp.com/send?text=${
          encodeURIComponent(`${props.title}\n${props.url}`)
        }`}
        target="_blank"
        aria-label={`WhatsApp'da ${props.title} paylaş`}
      >
        <IconBrandWhatsApp />
      </a>
      <a
        href={`https://t.me/share/url?url=${
          encodeURIComponent(props.url)
        }&text=${encodeURIComponent(props.title)}`}
        target="_blank"
        aria-label={`Telegram'da ${props.title} paylaş`}
      >
        <IconBrandTelegram />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?url=${
          encodeURIComponent(props.url)
        }&title=${encodeURIComponent(props.title)}`}
        target="_blank"
        aria-label={`LinkedIn'de ${props.title} paylaş`}
      >
        <IconBrandLinkedin />
      </a>
      <a
        href={`https://reddit.com/submit?url=${
          encodeURIComponent(props.url)
        }&title=${encodeURIComponent(props.title)}`}
        target="_blank"
        aria-label={`Reddit'de ${props.title} paylaş`}
      >
        <IconBrandReddit />
      </a>
      <a
        href={`https://twitter.com/share?url=${
          encodeURIComponent(props.url)
        }&text=${encodeURIComponent(props.title)}`}
        target="_blank"
        aria-label={`X'de ${props.title} paylaş`}
      >
        <IconBrandX />
      </a>
    </div>
  );
}
