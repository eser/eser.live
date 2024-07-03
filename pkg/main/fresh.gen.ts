// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_server_api_me_index from "./routes/(server)/api/me/index.ts";
import * as $_server_api_me_question_votes from "./routes/(server)/api/me/question-votes.ts";
import * as $_server_api_me_questions from "./routes/(server)/api/me/questions.ts";
import * as $_server_api_questions_id_ from "./routes/(server)/api/questions/[id].ts";
import * as $_server_api_questions_hide from "./routes/(server)/api/questions/hide.ts";
import * as $_server_api_questions_index from "./routes/(server)/api/questions/index.ts";
import * as $_server_api_questions_vote from "./routes/(server)/api/questions/vote.ts";
import * as $_server_api_users_id_index from "./routes/(server)/api/users/[id]/index.ts";
import * as $_server_api_users_id_questions from "./routes/(server)/api/users/[id]/questions.ts";
import * as $_server_api_users_index from "./routes/(server)/api/users/index.ts";
import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_layout from "./routes/_layout.tsx";
import * as $blog_slug_ from "./routes/blog/[slug].tsx";
import * as $blog_feed from "./routes/blog/feed.ts";
import * as $blog_index from "./routes/blog/index.tsx";
import * as $community_index from "./routes/community/index.tsx";
import * as $cookbook_index from "./routes/cookbook/index.tsx";
import * as $dash_index from "./routes/dash/index.tsx";
import * as $dash_stats from "./routes/dash/stats.tsx";
import * as $dash_users_id_ from "./routes/dash/users/[id].tsx";
import * as $dash_users_index from "./routes/dash/users/index.tsx";
import * as $index from "./routes/index.tsx";
import * as $projects_index from "./routes/projects/index.tsx";
import * as $qa_ask from "./routes/qa/ask.tsx";
import * as $qa_index from "./routes/qa/index.tsx";
import * as $setup_index from "./routes/setup/index.tsx";
import * as $_common_islands_questions_list from "./routes/(common)/(_islands)/questions-list.tsx";
import * as $_common_islands_share from "./routes/(common)/(_islands)/share.tsx";
import * as $_common_islands_shortcuts from "./routes/(common)/(_islands)/shortcuts.tsx";
import * as $_common_islands_users_table from "./routes/(common)/(_islands)/users-table.tsx";
import * as $dash_islands_chart from "./routes/dash/(_islands)/chart.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/(server)/api/me/index.ts": $_server_api_me_index,
    "./routes/(server)/api/me/question-votes.ts":
      $_server_api_me_question_votes,
    "./routes/(server)/api/me/questions.ts": $_server_api_me_questions,
    "./routes/(server)/api/questions/[id].ts": $_server_api_questions_id_,
    "./routes/(server)/api/questions/hide.ts": $_server_api_questions_hide,
    "./routes/(server)/api/questions/index.ts": $_server_api_questions_index,
    "./routes/(server)/api/questions/vote.ts": $_server_api_questions_vote,
    "./routes/(server)/api/users/[id]/index.ts": $_server_api_users_id_index,
    "./routes/(server)/api/users/[id]/questions.ts":
      $_server_api_users_id_questions,
    "./routes/(server)/api/users/index.ts": $_server_api_users_index,
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/_layout.tsx": $_layout,
    "./routes/blog/[slug].tsx": $blog_slug_,
    "./routes/blog/feed.ts": $blog_feed,
    "./routes/blog/index.tsx": $blog_index,
    "./routes/community/index.tsx": $community_index,
    "./routes/cookbook/index.tsx": $cookbook_index,
    "./routes/dash/index.tsx": $dash_index,
    "./routes/dash/stats.tsx": $dash_stats,
    "./routes/dash/users/[id].tsx": $dash_users_id_,
    "./routes/dash/users/index.tsx": $dash_users_index,
    "./routes/index.tsx": $index,
    "./routes/projects/index.tsx": $projects_index,
    "./routes/qa/ask.tsx": $qa_ask,
    "./routes/qa/index.tsx": $qa_index,
    "./routes/setup/index.tsx": $setup_index,
  },
  islands: {
    "./routes/(common)/(_islands)/questions-list.tsx":
      $_common_islands_questions_list,
    "./routes/(common)/(_islands)/share.tsx": $_common_islands_share,
    "./routes/(common)/(_islands)/shortcuts.tsx": $_common_islands_shortcuts,
    "./routes/(common)/(_islands)/users-table.tsx":
      $_common_islands_users_table,
    "./routes/dash/(_islands)/chart.tsx": $dash_islands_chart,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
