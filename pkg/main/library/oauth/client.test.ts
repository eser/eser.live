// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
// import * as assert from "@std/assert";
// import * as httpCookie from "@std/http/cookie";
// import * as httpStatus from "@std/http/status";
// import * as mock from "@std/testing/mock";
// import * as ulid from "@std/ulid";
// import { assertRedirect } from "../http/redirect.test.ts";
// import {
//   createClient,
//   getCookieName,
//   getSuccessUri,
//   SITE_COOKIE_NAME,
// } from "./client.ts";

// const randomOAuthSession = (): OAuthSession => {
//   return {
//     state: ulid.ulid(),
//     codeVerifier: ulid.ulid(),
//     successUrl: `http://${ulid.ulid()}.com`,
//   };
// };

// const randomTokensBody = () => {
//   return {
//     access_token: ulid.ulid(),
//     token_type: ulid.ulid(),
//   };
// };

// const createTestClient = () => {
//   const clientId = ulid.ulid();
//   const clientSecret = ulid.ulid();
//   const scope = ulid.ulid();

//   const testClient = createClient({
//     oauth: {
//       clientId,
//       clientSecret,
//       authorizationEndpointUri: "https://example.com/authorize",
//       tokenUri: "https://example.com/token",
//       defaults: {
//         scope,
//       },
//     },
//     hooks: {
//       setOAuthSession: setOAuthSession,
//       getAndDeleteOAuthSession: getAndDeleteOAuthSession,
//       deleteSiteSession: deleteSiteSession,
//       isSiteSession: isSiteSession,
//       setSiteSession: setSiteSession,
//     },
//   });

//   return { clientId, clientSecret, scope, testClient };
// };

// const createTestClientWithRedirectUri = () => {
//   const clientId = ulid.ulid();
//   const clientSecret = ulid.ulid();
//   const redirectUri = `http://${ulid.ulid()}.com`;
//   const scope = ulid.ulid();

//   const testClient = createClient({
//     oauth: {
//       clientId,
//       clientSecret,
//       redirectUri,
//       authorizationEndpointUri: "https://example.com/authorize",
//       tokenUri: "https://example.com/token",
//       defaults: {
//         scope,
//       },
//     },
//     hooks: {
//       setOAuthSession: setOAuthSession,
//       getAndDeleteOAuthSession: getAndDeleteOAuthSession,
//       deleteSiteSession: deleteSiteSession,
//       isSiteSession: isSiteSession,
//       setSiteSession: setSiteSession,
//     },
//   });

//   return { clientId, clientSecret, redirectUri, scope, testClient };
// };

// Deno.test("getCookieName()", () => {
//   assert.assertEquals(getCookieName("hello", true), "__Host-hello");
//   assert.assertEquals(getCookieName("hello", false), "hello");
// });

// Deno.test({
//   name: "getSuccessUri() returns `successUri` URL parameter, if defined",
//   fn: () => {
//     assert.assertEquals(
//       getSuccessUri(
//         new Request(
//           `http://example.com?successUri=${
//             encodeURIComponent("http://test.com")
//           }`,
//         ),
//       ),
//       "http://test.com",
//     );
//   },
// });

// Deno.test({
//   name: "getSuccessUri() returns referer header of same origin, if defined",
//   fn: () => {
//     const referer = "http://example.com/path";
//     assert.assertEquals(
//       getSuccessUri(
//         new Request("http://example.com", { headers: { referer } }),
//       ),
//       referer,
//     );
//   },
// });

// Deno.test({
//   name: "getSuccessUri() returns root path if referer is of different origin",
//   fn: () => {
//     assert.assertEquals(
//       getSuccessUri(
//         new Request("http://example.com", {
//           headers: { referer: "http://test.com" },
//         }),
//       ),
//       "/",
//     );
//   },
// });

// Deno.test({
//   name: "getSuccessUri() returns root path by default",
//   fn: () => {
//     assert.assertEquals(
//       getSuccessUri(new Request("http://example.com")),
//       "/",
//     );
//   },
// });

// Deno.test({
//   name: "createClient()",
//   fn: () => {
//     const { clientId, clientSecret, scope, redirectUri, testClient } =
//       createTestClientWithRedirectUri();

//     assert.assertEquals(testClient.state.options.oauth.clientId, clientId);
//     assert.assertEquals(
//       testClient.state.options.oauth.clientSecret,
//       clientSecret,
//     );
//     assert.assertEquals(
//       testClient.state.options.oauth.redirectUri,
//       redirectUri,
//     );
//     assert.assertEquals(
//       testClient.state.options.oauth.defaults?.scope,
//       scope,
//     );
//   },
// });

// Deno.test({
//   name: "Client.signIn() returns a response that signs-in the user",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const request = new Request("http://example.com/signin");
//     const response = await testClient.signIn(request);

//     assertRedirect(response, httpStatus.STATUS_CODE.Found);

//     const [setCookie] = httpCookie.getSetCookies(response.headers);

//     assert.assertEquals(setCookie.name, SITE_COOKIE_NAME);
//     assert.assertEquals(setCookie.httpOnly, true);
//     assert.assertEquals(setCookie.maxAge, 10 * 60);
//     assert.assertEquals(setCookie.sameSite, "Lax");
//     assert.assertEquals(setCookie.path, "/");

//     const oauthSessionId = setCookie.value;
//     const oauthSession = await getAndDeleteOAuthSession(oauthSessionId);

//     assert.assertNotEquals(oauthSession, null);

//     const location = response.headers.get("location")!;
//     const state = new URL(location).searchParams.get("state");

//     assert.assertEquals(oauthSession!.state, state);
//   },
// });

// Deno.test({
//   name: "Client.signIn() returns a redirect response with URL params",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const request = new Request("http://example.com/signin");
//     const response = await testClient.signIn(request, { foo: "bar" });

//     assertRedirect(response, httpStatus.STATUS_CODE.Found);

//     const location = response.headers.get("location")!;

//     assert.assertEquals(new URL(location).searchParams.get("foo"), "bar");
//   },
// });

// Deno.test({
//   name: "Client.handleCallback() rejects for no OAuth cookie",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const request = new Request("http://example.com");

//     await assert.assertRejects(
//       async () => await testClient.handleCallback(request),
//       Error,
//       "OAuth cookie not found",
//     );
//   },
// });

// Deno.test({
//   name: "Client.handleCallback() rejects for non-existent OAuth session",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const request = new Request("http://example.com", {
//       headers: { cookie: `${SITE_COOKIE_NAME}=xxx` },
//     });

//     await assert.assertRejects(
//       async () => await testClient.handleCallback(request),
//       Deno.errors.NotFound,
//       "OAuth session not found",
//     );
//   },
// });

// Deno.test({
//   name: "Client.handleCallback() deletes the OAuth session KV entry",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const oauthSessionId = ulid.ulid();
//     const oauthSession = randomOAuthSession();

//     await setOAuthSession(oauthSessionId, oauthSession, 1_000);

//     const request = new Request("http://example.com", {
//       headers: { cookie: `${SITE_COOKIE_NAME}=${oauthSessionId}` },
//     });

//     await assert.assertRejects(() => testClient.handleCallback(request));
//     await assert.assertRejects(
//       async () => await getAndDeleteOAuthSession(oauthSessionId),
//       Deno.errors.NotFound,
//       "OAuth session not found",
//     );
//   },
// });

// Deno.test({
//   name: "Client.handleCallback() correctly handles the callback response",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const tokensBody = randomTokensBody();
//     const fetchStub = mock.stub(
//       globalThis,
//       "fetch",
//       mock.returnsNext([Promise.resolve(Response.json(tokensBody))]),
//     );
//     const oauthSessionId = ulid.ulid();
//     const oauthSession = randomOAuthSession();

//     await setOAuthSession(oauthSessionId, oauthSession, 1_000);

//     const searchParams = new URLSearchParams({
//       "response_type": "code",
//       "client_id": "clientId",
//       "code_challenge_method": "S256",
//       "code": "code",
//       "state": oauthSession.state,
//     });
//     const request = new Request(
//       `http://example.com/callback?${searchParams}`,
//       {
//         headers: { cookie: `${SITE_COOKIE_NAME}=${oauthSessionId}` },
//       },
//     );

//     const { response, tokens, sessionId } = await testClient.handleCallback(
//       request,
//     );

//     fetchStub.restore();

//     assertRedirect(
//       response,
//       httpStatus.STATUS_CODE.Found,
//       oauthSession.successUrl,
//     );
//     assert.assertEquals(
//       response.headers.get("set-cookie"),
//       `site-session=${sessionId}; HttpOnly; Max-Age=7776000; SameSite=Lax; Path=/`,
//     );
//     assert.assertEquals(tokens.accessToken, tokensBody.access_token);
//     assert.assertEquals(typeof sessionId, "string");
//     await assert.assertRejects(
//       async () => await getAndDeleteOAuthSession(oauthSessionId),
//       Deno.errors.NotFound,
//       "OAuth session not found",
//     );
//   },
// });

// Deno.test({
//   name:
//     "Client.handleCallback() correctly handles the callback response with options",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const tokensBody = randomTokensBody();
//     const fetchStub = mock.stub(
//       globalThis,
//       "fetch",
//       mock.returnsNext([Promise.resolve(Response.json(tokensBody))]),
//     );
//     const oauthSessionId = ulid.ulid();
//     const oauthSession = randomOAuthSession();

//     await setOAuthSession(oauthSessionId, oauthSession, 1_000);

//     const searchParams = new URLSearchParams({
//       "response_type": "code",
//       "client_id": "clientId",
//       "code_challenge_method": "S256",
//       "code": "code",
//       "state": oauthSession.state,
//     });
//     const request = new Request(
//       `http://example.com/callback?${searchParams}`,
//       {
//         headers: { cookie: `${SITE_COOKIE_NAME}=${oauthSessionId}` },
//       },
//     );

//     const newTestClient = createClient({
//       ...testClient.state.options,
//       cookie: {
//         ...(testClient.state.options.cookie ?? {}),
//         name: "triple-choc",
//         maxAge: 420,
//         domain: "example.com",
//       },
//     });

//     const { response, tokens, sessionId } = await newTestClient
//       .handleCallback(
//         request,
//       );

//     fetchStub.restore();

//     assertRedirect(
//       response,
//       httpStatus.STATUS_CODE.Found,
//       oauthSession.successUrl,
//     );
//     assert.assertEquals(
//       response.headers.get("set-cookie"),
//       `${
//         newTestClient.state.options.cookie!.name
//       }=${sessionId}; HttpOnly; Max-Age=${
//         newTestClient.state.options.cookie!.maxAge
//       }; Domain=${
//         newTestClient.state.options.cookie!.domain
//       }; SameSite=Lax; Path=/`,
//     );
//     assert.assertEquals(tokens.accessToken, tokensBody.access_token);
//     assert.assertEquals(typeof sessionId, "string");
//     await assert.assertRejects(
//       async () => await getAndDeleteOAuthSession(oauthSessionId),
//       Deno.errors.NotFound,
//       "OAuth session not found",
//     );
//   },
// });

// Deno.test({
//   name:
//     "Client.signOut() returns a redirect response if the user is not signed-in",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const request = new Request("http://example.com/signout");
//     const response = await testClient.signOut(request);

//     assertRedirect(response, httpStatus.STATUS_CODE.Found, "/");
//   },
// });

// Deno.test({
//   name: "Client.signOut() returns a response that signs out the signed-in user",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const sessionId = ulid.ulid();
//     await setSiteSession(sessionId);
//     const request = new Request("http://example.com/signout", {
//       headers: {
//         cookie: `${SITE_COOKIE_NAME}=${sessionId}`,
//       },
//     });
//     const response = await testClient.signOut(request);

//     assertRedirect(response, httpStatus.STATUS_CODE.Found, "/");
//     assert.assertEquals(
//       response.headers.get("set-cookie"),
//       `${SITE_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
//     );
//   },
// });

// Deno.test({
//   name:
//     "Client.signOut() returns a response that signs out the signed-in user with cookie options",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const sessionId = ulid.ulid();
//     await setSiteSession(sessionId);

//     const newTestClient = createClient({
//       ...testClient.state.options,
//       cookie: {
//         ...(testClient.state.options.cookie ?? {}),
//         name: "triple-choc",
//         domain: "example.com",
//         path: "/path",
//       },
//     });
//     const request = new Request("http://example.com/signout", {
//       headers: {
//         cookie: `${newTestClient.state.options.cookie!.name}=${sessionId}`,
//       },
//     });

//     const response = await newTestClient.signOut(request);

//     assertRedirect(response, httpStatus.STATUS_CODE.Found, "/");
//     assert.assertEquals(
//       response.headers.get("set-cookie"),
//       `${newTestClient.state.options.cookie!.name}=; Domain=${
//         newTestClient.state.options.cookie!.domain
//       }; Path=${
//         newTestClient.state.options.cookie!.path
//       }; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
//     );
//   },
// });

// Deno.test({
//   name: "Client.getSessionId() returns undefined when cookie is not defined",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const request = new Request("http://example.com");

//     assert.assertEquals(await testClient.getSessionId(request), undefined);
//   },
// });

// Deno.test({
//   name: "Client.getSessionId() returns valid session ID",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const sessionId = ulid.ulid();
//     await setSiteSession(sessionId);
//     const request = new Request("http://example.com", {
//       headers: {
//         cookie: `${SITE_COOKIE_NAME}=${sessionId}`,
//       },
//     });

//     assert.assertEquals(await testClient.getSessionId(request), sessionId);
//   },
// });

// Deno.test({
//   name:
//     "Client.getSessionId() returns valid session ID when cookie name is defined",
//   fn: async () => {
//     const { testClient } = createTestClient();

//     const sessionId = ulid.ulid();
//     await setSiteSession(sessionId);

//     const newTestClient = createClient({
//       ...testClient.state.options,
//       cookie: {
//         ...(testClient.state.options.cookie ?? {}),
//         name: "triple-choc",
//       },
//     });
//     const request = new Request("http://example.com", {
//       headers: {
//         cookie: `${newTestClient.state.options.cookie!.name}=${sessionId}`,
//       },
//     });

//     assert.assertEquals(
//       await newTestClient.getSessionId(request),
//       sessionId,
//     );
//   },
// });
