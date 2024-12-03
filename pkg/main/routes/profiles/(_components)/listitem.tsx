import type { Profile } from "@/pkg/main/data/profile/types.ts";

type ProfileListItemProps = {
  profile: Profile;
};

export function ProfileListItem(props: ProfileListItemProps) {
  return (
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{props.profile.title}</h2>
        <p>{props.profile.kind}</p>
        <div class="card-actions justify-end">
          <a href={`/profiles/${props.profile.slug}`} class="btn btn-primary">
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
}
