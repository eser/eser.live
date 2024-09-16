// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { GitHubProject } from "@/pkg/main/services/github.ts";

export type ProjectListItemProps = {
  project: GitHubProject;
};

export function ProjectListItem(props: ProjectListItemProps) {
  return (
    <li key={props.project.id} class="card bg-base-100 shadow-xl mb-4">
      <div class="card-body">
        <h2 class="card-title">{props.project.name}</h2>
        <p>{props.project.description ?? ""}</p>
        <div class="card-actions justify-end">
          <a href={props.project.html_url} class="btn btn-primary" target="_blank" rel="noopener noreferrer">
            GitHub'da Görüntüle
          </a>
        </div>
      </div>
    </li>
  );
}
