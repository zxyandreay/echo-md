# Echo User Guide

Echo helps you write one Markdown draft and preview it for different publishing
contexts before you paste it elsewhere.

## Normal Workflow

1. Open Echo in the browser.
2. Write or paste Markdown into the editor.
3. Select GitHub, Discord, or Reddit preview mode.
4. Switch the preview between light and dark mode if needed.
5. Copy the Markdown source or rendered preview when the draft is ready.

## Preview Modes

### GitHub

GitHub mode approximates rendered README and comment Markdown. It uses GitHub
Flavored Markdown through `remark-gfm`, including:

- headings and paragraphs
- bold, italic, and strikethrough text
- links and images
- ordered and unordered lists
- task lists
- blockquotes
- inline code and fenced code blocks
- tables
- horizontal rules

The preview includes GitHub-style light and dark colors, borders, table rows,
code surfaces, content width, and spacing.

### Discord

Discord mode renders the draft as a chat message with an avatar, username,
timestamp, Discord-like colors, and message spacing. It supports:

- bold, italic, underline, and strikethrough text
- links
- inline code and fenced code blocks
- blockquotes
- hard line breaks
- spoilers written as `||hidden text||`

Discord does not render every GitHub Flavored Markdown feature. Echo does not
turn table syntax into a GitHub-style table in Discord mode.

### Reddit

Reddit mode presents the draft inside a post-style card with voting metadata and
an action row. It supports:

- headings and paragraphs
- links
- ordered and unordered lists
- quotes
- inline code and code blocks
- tables and other GFM syntax where appropriate
- spoilers written as `>!hidden text!<`

Both light and dark Reddit-style preview themes are available.

## Copying Content

| Control | Behavior |
| --- | --- |
| Copy Markdown | Copies the original Markdown source. |
| Copy HTML | Copies rendered preview HTML with a plain-text fallback. |
| Load Sample | Restores the included Markdown demonstration. |
| Clear | Removes the current draft. |
| Code block copy | Copies supported preview code blocks. |

Clipboard behavior depends on browser permissions and support. If rich HTML
copying is unavailable, Echo falls back to plain text where possible.

## Themes and Layouts

Echo has two independent theme controls:

- **App theme:** switches the surrounding Echo interface between light and dark
  mode.
- **Preview theme:** switches the simulated platform preview between light and
  dark mode.

The workspace can show both panes, editor only, or preview only. The layout is
responsive for desktop, tablet, and mobile screens.

## Data, Privacy, and Storage

Echo performs editing and Markdown rendering in the browser. The application has
no backend, account system, database, or paid API, and it does not upload draft
content by itself.

External images referenced in Markdown may be fetched by the browser when the
preview renders them. Links in the preview open in a new browser tab when
clicked.

The following values are stored in `localStorage` for the current browser
profile and origin:

| Key | Stored value |
| --- | --- |
| `echo-md:draft:v1` | Current Markdown draft |
| `echo-md:platform:v1` | Selected platform |
| `echo-md:theme:v1` | Echo interface theme |
| `echo-md:preview-theme:v1` | Platform preview theme |
| `echo-md:layout:v1` | Workspace layout |

Clearing browser site data removes these saved values. Raw HTML in Markdown is
not rendered.

## Limitations

- Platform previews are visual approximations, not pixel-perfect copies.
- Third-party Markdown behavior and interface styling can change over time.
- Echo does not publish content or connect to platform accounts.
- The app is available offline only when the browser already has the required
  static files cached.
