# eser.live web site

[![discord chat][discord-image]][discord-url] [![build][build-image]][build-url]
[![test coverage][coverage-image]][coverage-url] [![license][license-image]][license-url]

## Project Description

This codebase contains all the necessary code to operate the [eser.live](https://eser.live/) website. Since there's no
hidden parts -excluding some API keys- and it's completely open-source, it simply allows you to modify it or run your
own website by following the instructions below.

Additionally, this repository serves as a template for a full-stack web application built with
[Deno Fresh](https://fresh.deno.dev/) and [Tailwind CSS](https://tailwindcss.com/).

## Components

- Deno's built-in [formatter](https://deno.land/manual/tools/formatter), [linter](https://deno.land/manual/tools/linter)
  and [test runner](https://deno.land/manual/basics/testing) and TypeScript support
- Next-gen web framework with [Fresh](https://fresh.deno.dev/)
- Data persistence with [Drizzle ORM](https://orm.drizzle.team/)
- Modern CSS framework with [Tailwind CSS](https://tailwindcss.com/)
- UI components with [Daisy UI](https://daisyui.com/)
- Pre-commit hooks with [pre-commit](https://pre-commit.com/)

## Get Started

### Get Started Locally

Before starting, you'll need:

- A GitHub account
- The [Deno CLI](https://deno.com/manual/getting_started/installation) and
  [Git](https://github.com/git-guides/install-git) installed on your machine

To get started:

1. Clone this repo:
   ```bash
   git clone https://github.com/eser/eser.live.git
   cd eser.live
   ```
1. Create a new `.env` file:
   ```
   POSTGRES_CONNSTR=postgres://postgres:s3cr3t@0.0.0.0:5432/postgres
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   YOUTUBE_API_KEY=
   ```
1. Navigate to GitHub's [**New OAuth Application** page](https://github.com/settings/applications/new).
1. Set **Application name** to your desired application name. E.g. `ACME, Inc`.
1. Set **Homepage URL** to `http://localhost:8000`.
1. Set **Authorization callback URL** to `http://localhost:8000/auth/callback`.
1. Click **Register application**.
1. Copy the **Client ID** value to the `.env` file:
   ```bash
   GITHUB_CLIENT_ID=<GitHub OAuth application client ID>
   ```
1. On the same web page, click **Generate a new client secret**.
1. Copy the **Client secret** value to the `.env` file on a new line:
   ```bash
   GITHUB_CLIENT_SECRET=<GitHub OAuth application client secret>
   ```
1. Start the server:
   ```bash
   deno task start
   ```
1. Navigate to `http://localhost:8000` to start playing with the app.

### Bootstrap the Database

Use the following commands to work with your local database:

- `deno task db:migrate` - Populate the database with data.
- `deno task db:reset` - Reset the database. This is not recoverable.

## Customize and Extend

### Global Constants

The [./pkg/main/constants.ts](./pkg/main/constants.ts) file includes global values used across various aspects of the
codebase. Update these values according to your needs.

### Stylesheets

You can create and customize styles within the capabilities of [Tailwind CSS](https://tailwindcss.com/) and
[Daisy UI](https://daisyui.com/). Tailwind configuration can be found at
[./pkg/main/tailwind.config.ts](./pkg/main/tailwind.config.ts).

## Deploy to Production

This section assumes that a [local development environment](#getting-started-locally) is already set up.

1. Navigate to your [GitHub OAuth application settings page](https://github.com/settings/developers).
1. Set the **Homepage URL** to your production URL. E.g. `https://eser.live`.
1. Set the **Authorization callback URL** to your production URL with the `/auth/callback` path. E.g.
   `https://eser.live/auth/callback`.
1. Copy all the environment variables in your `.env` file to your production environment.

### Deploy to [Deno Deploy](https://deno.com/deploy)

1. Clone this repository.
1. Sign into [Deno Deploy](https://dash.deno.com) with your GitHub account.
1. Select your GitHub organization or user, repository, and branch.
1. Select **Automatic** deployment mode and `main.ts` as the entry point.
1. Click **Link**, which will start the deployment.
1. Once the deployment is complete, click on **Settings** and add the production environmental variables, then hit
   **Save**.

You should now be able to visit your newly deployed SaaS.

### Deploy to any VPS with Docker

[Docker](https://docker.com) makes it easy to deploy and run your Deno app to any virtual private server (VPS). This
section will show you how to do that with AWS Lightsail and Digital Ocean.

1. [Install Docker](https://docker.com) on your machine, which should also install
   [the `docker` CLI](https://docs.docker.com/engine/reference/commandline/cli/).
1. Create an account on [Docker Hub](https://hub.docker.com), a registry for Docker container images.

> Note: the [`Dockerfile`](./Dockerfile), [`.dockerignore`](./.dockerignore) and
> [`docker-compose.yml`](./docker-compose.yml) files come included with this repo.

1. Grab the SHA1 commit hash by running the following command in the repo's root folder:

```sh
# get the SHA1 commit hash of the current branch
git rev-parse HEAD
```

1. Copy the output of the above and paste it as `DENO_DEPLOYMENT_ID` in your .env file. This value is needed to enable
   caching on Fresh in a Docker deployment.

1. Finally, refer to these guides for using Docker to deploy Deno to specific platforms:

- [Amazon Lightsail](https://deno.land/manual/advanced/deploying_deno/aws_lightsail)
- [Digital Ocean](https://deno.land/manual/advanced/deploying_deno/digital_ocean)
- [Google Cloud Run](https://deno.land/manual/advanced/deploying_deno/google_cloud_run)

## REST API Reference

### `GET /qa/`

Get all questions in chronological order. Add `?cursor=<cursor>` URL parameter for pagination. Limited to 10 questions
per page.

Example 1:

```jsonc
// https://eser.live/qa/
{
  "items": [
    // 9 more items...
    {
      "id": "01HRRK8DNTDEX83265MX9G2MHD",
      "userLogin": "eser",
      "question": "Test sorusu",
      "score": 1,
      "hidden": false
    }
  ],
  "cursor": "01HRRK8DNTDEX83265MX9G2MHD"
}
```

Example 2 (using `cursor` field from page 1):

```jsonc
// https://eser.live/qa/?cursor=01HRRK8DNTDEX83265MX9G2MHD
{
  "items": [
    // 7 more items...
  ],
  "cursor": ""
}
```

### `GET /qa/:id/`

Get the question with the given ID.

Example:

```jsonc
// https://eser.live/qa/01HRRK8DNTDEX83265MX9G2MHD/
{
  "id": "01HRRK8DNTDEX83265MX9G2MHD",
  "userLogin": "eser",
  "question": "Test sorusu",
  "score": 1,
  "hidden": false
}
```

### `GET /users/`

Get all users in alphabetical order by GitHub login. Add `?cursor=<cursor>` URL parameter for pagination. Limited to 10
users per page.

Example:

```jsonc
// https://eser.live/users/
{
  "items": [
    {
      "login": "eser",
      "sessionId": "1b10cfe8-25c4-4d77-b999-0602fa1760cc"
    }
  ],
  "cursor": ""
}
```

### `GET /users/:login/`

Get the user with the given GitHub login.

Example:

```jsonc
// https://eser.live/users/eser/
{
  "login": "eser",
  "sessionId": "1b10cfe8-25c4-4d77-b999-0602fa1760cc"
}
```

## Acknowledgement, Goals and Philosophy

This codebase is a fork of [Deno SaaSKit](https://github.com/denoland/saaskit), we would like to thank the contributors
and maintainers of the original project.

Our project maintains the same philosophy and goals of the original project, but with some modifications to fit the
needs of the eser.live and the community around us.

For the user, the website should be fast, secure and have a design with clear intent. Additionally, the HTML should be
well-structured and indexable by search engines. The defining metrics for these goals are:

- A perfect [PageSpeed Insights](https://pagespeed.web.dev/) score.
- Fully valid HTML, as measured by [W3C's Markup Validation Service](https://validator.w3.org/).

For the developer, the codebase should minimize the steps and amount of time required to get up and running. From there,
customization and extension of the web app should be simple. The characteristics of a well-written codebase also apply,
such as:

- Easy to understand
- Modular functionality
- Clearly defined behavior with validation through tests

### Requirements

- Deno 1.44 or higher (https://deno.land/)
- pre-commit (https://pre-commit.com/)

### Versioning

This project follows [Semantic Versioning](https://semver.org/). For the versions available, see the
[tags on this repository](https://github.com/eser/eser.live/tags).

## Community and Resources

Join [the `#lobi` channel in eser.live Discord][discord-url] to ask questions, and get unblocked.

### License

This project is licensed under the MIT License. For further details, please see the [LICENSE](LICENSE) file.

### To support the project...

[Visit my GitHub Sponsors profile at github.com/sponsors/eser](https://github.com/sponsors/eser)

[discord-image]: https://img.shields.io/discord/684898665143206084?logo=discord&style=social
[discord-url]: https://discord.eser.live/
[build-image]: https://github.com/eser/eser.live/actions/workflows/ci-cd.yml/badge.svg
[build-url]: https://github.com/eser/eser.live/actions/workflows/ci-cd.yml
[coverage-image]: https://codecov.io/gh/eser/eser.live/branch/main/graph/badge.svg?token=77F8TYTP13
[coverage-url]: https://codecov.io/gh/eser/eser.live
[license-image]: https://img.shields.io/github/license/eser/eser.live.svg?style=flat-square
[license-url]: https://github.com/eser/eser.live/blob/main/LICENSE
