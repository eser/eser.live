// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { GitHubProject } from "@/pkg/main/services/github.ts";

type ProjectListItemProps = {
  project: GitHubProject;
};

export function ProjectListItem(props: ProjectListItemProps) {
  return (
    <li key={props.project.id} class="card bg-base-200 shadow-xl mb-4">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <h2 class="card-title">
            <a href={props.project.html_url} class="link link-hover" target="_blank" rel="noopener noreferrer">
              {props.project.name}
            </a>
          </h2>
          <div class="flex flex-wrap gap-2">
            {props.project.language && <span class="badge badge-primary">{props.project.language}</span>}
            <span class="badge badge-secondary">
              🍴 {props.project.forks_count}
            </span>
            <span class="badge badge-secondary">
              ⭐ {props.project.stargazers_count}
            </span>
          </div>
        </div>
        <p>{props.project.description ?? "-"}</p>
        <div class="mt-2">
          <p class="text-sm">
            Son güncelleme: {new Date(props.project.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </li>
  );
}
