// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
// import * as assert from "@std/assert";
// import { getPost, getPosts } from "./posts.ts";

// Deno.test("[blog] getPost()", async () => {
//   const post = await getPost("first-post");
//   assert.assert(post);
//   assert.assertEquals(post.publishedAt, new Date("2022-11-04T15:00:00.000Z"));
//   assert.assertEquals(post.summary, "This is an excerpt of my first blog post.");
//   assert.assertEquals(post.title, "This is my first blog post!");
//   assert.assertEquals(await getPost("third-post"), null);
// });

// Deno.test("[blog] getPosts()", async () => {
//   const posts = await getPosts();
//   assert.assert(posts);
//   assert.assertEquals(posts.length, 2);
// });
