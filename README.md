# Echo

**Echo is a browser-based Markdown editor for writers who want to preview one
draft in GitHub, Discord, and Reddit styles before posting.**

Markdown can change shape across publishing surfaces. Echo keeps editing,
platform selection, theming, and copying in one local-first browser workflow so
authors can catch formatting surprises before they paste content elsewhere.

[Live Demo](https://zxyandreay.github.io/echo-md/) |
[User Guide](./docs/USER_GUIDE.md) |
[Development Guide](./docs/DEVELOPMENT.md) |
[Repository](https://github.com/zxyandreay/echo-md)

## Highlights

- Preview one Markdown draft as GitHub-style content, a Discord-style message,
  or a Reddit-style post.
- Switch independent light and dark themes for the app shell and platform
  preview.
- Use split, editor-only, or preview-only layouts on desktop and smaller
  screens.
- Copy the original Markdown or the rendered preview with a plain-text fallback.
- Store drafts and interface preferences in browser `localStorage`; no backend,
  account, database, or paid API is required.
- Run and deploy as a static Vite app configured for GitHub Pages.

## How It Works

1. Write or paste Markdown into the editor.
2. Choose GitHub, Discord, or Reddit preview mode.
3. Review the styled preview and switch light or dark preview themes as needed.
4. Copy the Markdown source or rendered preview when ready.

## Tech Stack

- **Frontend:** React
- **Language:** TypeScript
- **Markdown:** `react-markdown`, `remark-gfm`, `remark-breaks`
- **UI:** Lucide React
- **Data / Backend:** Browser `localStorage`; no backend service
- **Tooling:** Vite, ESLint
- **Deployment:** GitHub Pages

## Getting Started

### Requirements

- Current Node.js LTS release
- npm
- Git

### Install and Run

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

## Usage

1. Open the [live demo](https://zxyandreay.github.io/echo-md/) or run Echo
   locally.
2. Write or paste Markdown into the editor.
3. Select a platform preview and preview theme.
4. Use the layout controls to focus on writing, previewing, or both.
5. Copy the Markdown source or rendered preview when finished.

For platform-specific behavior, copy options, and storage details, see the
[User Guide](./docs/USER_GUIDE.md).

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run lint` | Run ESLint across the project. |
| `npm run build` | Type-check with `tsc -b` and create the production `dist` build. |
| `npm run preview` | Serve the production build locally. |

## Data, Privacy, and Security

- **Data storage:** Drafts and interface preferences are stored in the current
  browser profile using `localStorage`.
- **Network use:** Echo has no backend and does not upload draft content by
  itself. External images referenced in Markdown may still be fetched by the
  browser when rendered.
- **Authentication:** Echo does not use accounts or connect to GitHub, Discord,
  or Reddit.
- **Rendered content:** Raw HTML in Markdown is skipped instead of rendered.
- **Data recovery:** Clearing browser site data removes saved drafts and
  settings for that origin.

## Project Structure

```text
echo-md/
|-- .github/workflows/deploy.yml  # GitHub Pages deployment workflow
|-- docs/                         # User and development documentation
|-- public/favicon.svg            # Static browser icon
|-- src/                          # React app, preview renderers, and styling
|-- index.html                    # Vite HTML entry point
|-- package.json                  # npm scripts and dependencies
|-- vite.config.ts                # Vite config with the /echo-md/ base path
`-- README.md
```

## Documentation

- [User Guide](./docs/USER_GUIDE.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## Status and Limitations

**Status:** Active source-available project and portfolio reference.

- Platform previews are visual approximations and can differ from the current
  production interfaces of GitHub, Discord, or Reddit.
- Supported Markdown syntax on third-party platforms can change over time.
- Echo does not publish content or connect to platform accounts.
- Clipboard behavior depends on browser permissions and support.
- Browser storage is local to the current browser profile and origin.
- Echo does not currently include a service worker or automated test suite.

## Contributing

This project is primarily maintained as a personal product and portfolio
reference. Feedback and issue reports are welcome, but unsolicited feature pull
requests may not be accepted.

Before proposing a change, keep platform-specific behavior separated, preserve
the static GitHub Pages deployment model, and run the validation commands in the
[Development Guide](./docs/DEVELOPMENT.md).

## License

Echo is source-available for learning and portfolio review. It is not licensed
for copying, redistribution, publishing, monetization, commercial use, or
modified redistribution without written permission from the author.

See [`LICENSE`](./LICENSE) for the complete terms.

## Author

Built by [zxyandreay](https://github.com/zxyandreay).

## Disclaimer

GitHub, Discord, and Reddit are trademarks of their respective owners. Echo is
not affiliated with or endorsed by those platforms. Platform names are used only
to identify the preview style being approximated.
