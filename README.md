# Echo

**Write once. Preview everywhere.**

Echo is a browser-based Markdown editor that shows how the same draft may look
when published on GitHub, Discord, or Reddit. It is designed for the formatting
differences that generic Markdown editors miss: platform-specific spacing,
colors, typography, supported syntax, message chrome, and light or dark
appearance.

**Live demo:** [https://zxyandreay.github.io/echo-md/](https://zxyandreay.github.io/echo-md/)

**Repository:** [https://github.com/zxyandreay/echo-md](https://github.com/zxyandreay/echo-md)

Source-available for learning and portfolio review. Commercial use requires
permission from the author. See [License](#license).

## Why Echo?

Markdown is not rendered identically everywhere. A README on GitHub, a message
in Discord, and a Reddit post can use similar syntax while producing noticeably
different results. Some features are platform-specific, and unsupported syntax
may be displayed as plain text.

Echo keeps one editable Markdown draft and lets you switch among platform-style
previews before posting. The previews are visual approximations rather than
pixel-perfect copies of the platforms.

## Features

- Live Markdown editor with immediate preview updates.
- GitHub, Discord, and Reddit platform preview modes.
- Independent light and dark themes for the Echo interface and preview surface.
- Split, editor-only, and preview-only workspace layouts.
- Browser persistence for the draft and interface settings.
- Copy the original Markdown or the rendered preview as HTML and plain text.
- Platform-style copy controls on supported preview code blocks.
- Built-in sample content demonstrating common Markdown features.
- Responsive layout for desktop, tablet, and mobile screens.
- Static, client-only operation with no backend, account, database, or paid API.
- GitHub Pages deployment configured for the `/echo-md/` project path.

## Platform Previews

### GitHub

The GitHub mode approximates rendered README and comment Markdown. It supports
GitHub Flavored Markdown through `remark-gfm`, including:

- headings and paragraphs;
- bold, italic, and strikethrough text;
- links and images;
- ordered and unordered lists;
- task lists;
- blockquotes;
- inline code and fenced code blocks;
- tables; and
- horizontal rules.

The preview includes GitHub-style light and dark colors, borders, table rows,
code surfaces, content width, and spacing.

### Discord

The Discord mode renders the draft as a chat message with an avatar, username,
timestamp, Discord-like colors, and message spacing. It supports:

- bold, italic, underline, and strikethrough text;
- links;
- inline code and fenced code blocks;
- blockquotes;
- hard line breaks; and
- spoilers written as `||hidden text||`.

Discord does not render every GitHub Flavored Markdown feature. Echo therefore
does not turn table syntax into a GitHub-style table in Discord mode.

### Reddit

The Reddit mode presents the draft inside a post-style card with voting,
metadata, and action rows. It supports:

- headings and paragraphs;
- links;
- ordered and unordered lists;
- quotes;
- inline code and code blocks;
- tables and other GFM syntax where appropriate; and
- spoilers written as `>!hidden text!<`.

Both light and dark Reddit-style preview themes are available.

## Using Echo

1. Open the [live demo](https://zxyandreay.github.io/echo-md/).
2. Write or paste Markdown into the editor.
3. Select **GitHub**, **Discord**, or **Reddit**.
4. Choose a light or dark platform preview.
5. Switch the workspace between split, editor-only, and preview-only layouts as
   needed.
6. Copy the Markdown or rendered preview when it is ready.

Useful controls:

| Control | Behavior |
| --- | --- |
| Copy Markdown | Copies the original Markdown source. |
| Copy HTML | Copies safe rendered HTML with a plain-text fallback. |
| Load Sample | Restores the included Markdown demonstration. |
| Clear | Removes the current draft. |
| Layout buttons | Show both panes, only the editor, or only the preview. |
| Preview theme | Switches the simulated platform between light and dark mode. |
| App theme | Switches the surrounding Echo interface theme. |

Raw HTML in Markdown is not rendered. This keeps preview output safer and
prevents pasted HTML from being executed by the application.

## Local Storage And Privacy

Echo performs all editing and rendering locally in the browser. Draft content
is not uploaded to a server by the application.

The following settings are stored in `localStorage`:

| Key | Stored value |
| --- | --- |
| `echo-md:draft:v1` | Current Markdown draft |
| `echo-md:platform:v1` | Selected platform |
| `echo-md:theme:v1` | Echo interface theme |
| `echo-md:preview-theme:v1` | Platform preview theme |
| `echo-md:layout:v1` | Workspace layout |

Clearing site data in the browser removes these saved values.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [remark-breaks](https://github.com/remarkjs/remark-breaks)
- [Lucide React](https://lucide.dev/)

## Project Structure

```text
echo-md/
|-- .github/workflows/deploy.yml  # GitHub Pages workflow
|-- public/favicon.svg            # Echo browser icon
|-- src/
|   |-- App.tsx                   # App state, controls, and preview renderers
|   |-- App.css                   # App and platform-specific styling
|   |-- index.css                 # Global styles
|   `-- main.tsx                  # React entry point
|-- commit-and-push.bat           # Local Windows validation/commit helper
|-- index.html
|-- package.json
|-- README.md
`-- vite.config.ts                # Includes the /echo-md/ Pages base path
```

The preview architecture uses one app shell and separate GitHub, Discord, and
Reddit render paths. Shared parsing is used where platform behavior overlaps,
while platform-specific preprocessing and CSS handle differences such as
spoilers, line breaks, tables, and presentation chrome.

## Local Development

### Requirements

- A current Node.js LTS release
- npm
- Git

### Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/zxyandreay/echo-md.git
cd echo-md
npm install
```

Start the development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal.

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
| `npm run build` | Type-check and generate the production `dist` directory. |
| `npm run preview` | Serve the production build locally. |
| `commit-and-push.bat` | Run lint/build, prompt for a commit message, commit, and push on Windows. |

Before submitting changes, run:

```bash
npm run lint
npm run build
```

## GitHub Pages Deployment

Echo is a static single-page application with no client-side routes. The Vite
configuration sets:

```ts
base: '/echo-md/'
```

This ensures scripts, styles, and public assets resolve correctly from the
GitHub Pages project URL rather than the domain root.

The workflow at `.github/workflows/deploy.yml`:

1. checks out `main`;
2. installs the current Node.js LTS release;
3. installs dependencies with `npm ci`;
4. builds the app;
5. uploads `dist` as the Pages artifact; and
6. deploys it with GitHub's Pages action.

To enable deployment, open **Settings -> Pages** in the GitHub repository and
select **GitHub Actions** as the source. Every push to `main` then triggers a
deployment. The workflow can also be run manually.

## Adding Another Platform

The platform types and options are defined in `src/App.tsx`. A new platform
generally requires:

1. adding its identifier to `PlatformMode`;
2. adding an entry to the platform selector;
3. creating a preview renderer;
4. adding preprocessing only for syntax that differs from the shared parser;
5. adding dedicated light and dark CSS; and
6. routing the new renderer through `PlatformPreview`.

This structure is intended to support future previews such as Slack, Notion,
Stack Overflow, or Microsoft Teams without rewriting the editor shell.

## Limitations

- Platform previews are approximations and may differ from the current
  production interfaces of GitHub, Discord, or Reddit.
- The supported Markdown syntax on third-party platforms can change over time.
- Echo does not publish content or connect to platform accounts.
- Clipboard behavior depends on browser permissions and support.
- Browser storage is local to the current browser profile and origin.
- The application is available offline only when the browser has already cached
  the required static files; it does not currently install a service worker.

## Contributing

Issues and suggestions are welcome for discussion. Before proposing a change:

1. keep platform behavior separated where syntax or styling differs;
2. preserve the static GitHub Pages deployment model;
3. avoid adding backend services, authentication, or paid APIs;
4. run lint and build checks; and
5. review the source-available license before copying, publishing, or
   redistributing code.

## License

Echo is source-available for learning and portfolio review.

You may view and study the code for personal and educational purposes, but you
may not copy, redistribute, publish, resell, monetize, or use this project or
modified versions commercially without written permission from the author.

For commercial use, licensing, or permission requests, please contact the
author.

See the [LICENSE](LICENSE) file for the complete terms.

## Disclaimer

GitHub, Discord, and Reddit are trademarks of their respective owners. Echo is
not affiliated with or endorsed by those platforms. Platform names are used
only to identify the preview style being approximated.
