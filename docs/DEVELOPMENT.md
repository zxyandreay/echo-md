# Echo Development Guide

This guide covers local setup, validation, project structure, and the GitHub
Pages deployment model for Echo.

## Requirements

- Current Node.js LTS release
- npm
- Git

## Setup

```bash
git clone https://github.com/zxyandreay/echo-md.git
cd echo-md
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

On Windows systems where PowerShell blocks `npm.ps1`, use the command shim:

```powershell
npm.cmd install
npm.cmd run dev
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run lint` | Run ESLint across the project. |
| `npm run build` | Type-check with `tsc -b` and create the production `dist` build. |
| `npm run preview` | Serve the production build locally. |

There is no automated test script configured in `package.json`. Use lint and
build checks as the current validation baseline.

## Project Structure

```text
echo-md/
|-- .github/workflows/deploy.yml  # GitHub Pages deployment workflow
|-- docs/                         # User and development documentation
|-- public/favicon.svg            # Static browser icon
|-- src/
|   |-- App.tsx                   # App state, controls, preview renderers
|   |-- App.css                   # App styling and platform preview CSS
|   |-- index.css                 # Global styles
|   `-- main.tsx                  # React entry point
|-- index.html
|-- package.json
|-- tsconfig*.json
`-- vite.config.ts                # Includes the /echo-md/ Pages base path
```

Generated output, dependency directories, logs, and local helper scripts are
ignored by `.gitignore`.

## Rendering Model

- `src/App.tsx` owns the editor state, `localStorage` persistence, clipboard
  handlers, layout controls, and platform renderer routing.
- Platform modes are currently `github`, `discord`, and `reddit`.
- GitHub and Reddit previews use `remark-gfm` where GitHub Flavored Markdown is
  appropriate.
- Discord preview uses `remark-breaks` and platform-specific preprocessing for
  underline, strikethrough, and spoiler tokens.
- Reddit preview preprocesses Reddit spoiler syntax before rendering.
- All preview renderers use `skipHtml`, so raw HTML in Markdown is not rendered.
- `src/App.css` contains both the app shell styling and the platform-specific
  light and dark preview styles.

## GitHub Pages Deployment

Echo is a static single-page application with no client-side routes. The Vite
configuration sets:

```ts
base: '/echo-md/'
```

The workflow at `.github/workflows/deploy.yml` runs on pushes to `main` and can
also be run manually. It installs dependencies with `npm ci`, builds the app,
uploads `dist` as the Pages artifact, and deploys with GitHub's Pages action.

To enable deployment in GitHub, open the repository's Pages settings and use
GitHub Actions as the source.

## Adding Another Platform

A new platform generally requires:

1. Add its identifier to `PlatformMode` in `src/App.tsx`.
2. Add an entry to the platform selector.
3. Create a preview renderer.
4. Add preprocessing only for syntax that differs from the shared parser.
5. Add dedicated light and dark CSS.
6. Route the new renderer through `PlatformPreview`.

Keep platform behavior separated where syntax or styling differs, and preserve
the static deployment model unless the project scope changes.

## Validation

Run the current repository checks before submitting changes:

```bash
npm run lint
npm run build
```

`npm run build` runs `tsc -b` before creating the production Vite build.
