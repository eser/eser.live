// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
// Description: Seeds the kv db with Hacker News stories
import { createUser } from "@/utils/db.ts";
import { ulid } from "std/ulid/mod.ts";

// Reference: https://github.com/HackerNews/API
const API_BASE_URL = `https://hacker-news.firebaseio.com/v0`;
const API_ITEM_URL = `${API_BASE_URL}/item`;
const API_TOP_STORIES_URL = `${API_BASE_URL}/topstories.json`;
const TOP_STORIES_COUNT = 10;

interface Story {
  id: number;
  score: number;
  time: number; // Unix seconds
  by: string;
  title: string;
  url: string;
}

const resp = await fetch(API_TOP_STORIES_URL);
const allTopStories = await resp.json() as number[];
const topStories = allTopStories.slice(0, TOP_STORIES_COUNT);
const storiesPromises = [];

for (const id of topStories) {
  storiesPromises.push(fetch(`${API_ITEM_URL}/${id}.json`));
}

const storiesResponses = await Promise.all(storiesPromises);
const stories = await Promise.all(
  storiesResponses.map((r) => r.json()),
) as Story[];
const items = stories.map(({ by: userLogin, title, url, score, time }) => ({
  id: ulid(),
  userLogin,
  title,
  url,
  score,
  createdAt: new Date(time * 1000),
})).filter(({ url }) => url);

const users = new Set(items.map((s) => s.userLogin));

const userPromises = [];
for (const login of users) {
  userPromises.push(
    createUser({
      login,
      sessionId: crypto.randomUUID(),
    }),
  );
}
await Promise.all(userPromises);
