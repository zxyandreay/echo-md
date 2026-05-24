# Echo

Write once. Preview everywhere.

Echo is a static Markdown editor and preview tool for checking how the same Markdown may look on GitHub, Discord, and Reddit before you post it.

Live demo: <https://zxyandreay.github.io/echo-md/>

## Features

- Live Markdown editor with a persistent local draft.
- Platform preview modes for GitHub, Discord, and Reddit.
- GitHub-style GFM rendering for headings, links, code, tables, task lists, images, and strikethrough.
- Discord-style message preview with dark chat styling, code blocks, quotes, underline, strikethrough, and `||spoiler||` support.
- Reddit-style post/comment preview with vote/action chrome, links, quotes, lists, code, and `>!spoiler!<` support.
- Independent light/dark controls for the Echo app shell and the platform preview theme.
- Copy Markdown, copy rendered HTML/text, clear editor, load sample, and layout switching.
- Fully static app with no backend, database, authentication, or paid APIs.

Platform previews are approximations and may differ slightly from the actual apps.

## Tech Stack

- React
- Vite
- TypeScript
- react-markdown
- remark-gfm
- remark-breaks
- lucide-react

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

On Windows PowerShell with script execution disabled, use `npm.cmd`:

```bash
npm.cmd install
npm.cmd run dev
```

## Build

Run linting and create a production build:

```bash
npm run lint
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The Vite config sets `base: "/echo-md/"` so generated assets work under the GitHub Pages project URL.

## GitHub Pages Deployment

This repository includes `.github/workflows/deploy.yml`, which builds the Vite app and deploys `dist` to GitHub Pages.

In GitHub, open repository Settings -> Pages and set the build source to GitHub Actions. After changes are pushed to `main`, the workflow will publish Echo to:

<https://zxyandreay.github.io/echo-md/>

No routing configuration is required because Echo is a single-page static app without client-side routes.
