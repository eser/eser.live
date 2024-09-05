import { Story } from "@/pkg/main/data/models/story.ts";
import { SITE_LOCALE } from "@/pkg/main/constants.ts";

export interface StoryCardProps {
  item: Story;
}

export function StoryCard(props: StoryCardProps) {
  const publishedAtStr = props.item.publishedAt!.toString();
  const publishedAt = new Date(publishedAtStr);

  return (
    <div class="group card card-compact">
      <a class="no-underline" href={`/stories/${props.item.slug}`}>
        <div class="card-body">
          <h2 class="card-title group-hover:underline underline-offset-2">
            {props.item.title}
          </h2>
          {props.item.publishedAt !== null && (
            <div class="card-actions">
              <time
                dateTime={publishedAt.toISOString()}
                class="text-slate-500"
              >
                {publishedAt.toLocaleDateString(SITE_LOCALE, {
                  dateStyle: "long",
                })}
              </time>
            </div>
          )}
        </div>
      </a>
    </div>
  );
}
