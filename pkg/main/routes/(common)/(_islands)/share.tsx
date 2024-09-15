// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import IconBrandLinkedin from "tabler_icons_tsx/brand-linkedin.tsx";
import IconBrandReddit from "tabler_icons_tsx/brand-reddit.tsx";
import IconBrandTelegram from "tabler_icons_tsx/brand-telegram.tsx";
import IconBrandWhatsApp from "tabler_icons_tsx/brand-whatsapp.tsx";
import IconBrandX from "tabler_icons_tsx/brand-x.tsx";
import IconDownload from "tabler_icons_tsx/download.tsx";
import IconShare from "tabler_icons_tsx/share.tsx";

export type ShareProps = {
  url: string;
  title: string;
  content: string;
  publishedAt: Date | null;
};

/**
 * Dynamically generates links for sharing the current content on the major
 * social media platforms.
 *
 * @see {@link https://schier.co/blog/pure-html-share-buttons}
 */
export const Share = (props: ShareProps) => {
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
      <a href={props.url} aria-label={`Share ${props.title}`} onClick={handleClick}>
        <IconShare />
      </a>
      <a
        href={`https://web.whatsapp.com/send?text=${encodeURIComponent(`${props.title}\n${props.url}`)}`}
        target="_blank"
        aria-label={`WhatsApp'da ${props.title} paylaş`}
        rel="noreferrer"
      >
        <IconBrandWhatsApp />
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`}
        target="_blank"
        aria-label={`Telegram'da ${props.title} paylaş`}
        rel="noreferrer"
      >
        <IconBrandTelegram />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?url=${
          encodeURIComponent(
            props.url,
          )
        }&title=${encodeURIComponent(props.title)}`}
        target="_blank"
        aria-label={`LinkedIn'de ${props.title} paylaş`}
        rel="noreferrer"
      >
        <IconBrandLinkedin />
      </a>
      <a
        href={`https://reddit.com/submit?url=${encodeURIComponent(props.url)}&title=${encodeURIComponent(props.title)}`}
        target="_blank"
        aria-label={`Reddit'de ${props.title} paylaş`}
        rel="noreferrer"
      >
        <IconBrandReddit />
      </a>
      <a
        href={`https://twitter.com/share?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`}
        target="_blank"
        aria-label={`X'de ${props.title} paylaş`}
        rel="noreferrer"
      >
        <IconBrandX />
      </a>
      <a
        href={`data:text/markdown;charset=utf-8,${encodeURIComponent(props.content)}`}
        download={`${props.title.replace(/\s+/g, "_")}.md`}
        aria-label={`${props.title} içeriğini Markdown olarak indir`}
      >
        <IconDownload />
      </a>
    </div>
  );
};
