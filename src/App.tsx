import {
  Check,
  Clipboard,
  Code2,
  Columns2,
  Copy,
  FileText,
  Moon,
  PanelLeft,
  PanelRight,
  RotateCcw,
  Sun,
  Trash2,
} from 'lucide-react'
import {
  type ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Markdown, { type Components } from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import './App.css'

type PlatformMode = 'github' | 'discord' | 'reddit'
type ThemeMode = 'light' | 'dark'
type PreviewThemeMode = ThemeMode
type LayoutMode = 'split' | 'editor' | 'preview'
type TokenKind = 'spoiler' | 'underline' | 'strike'
type CodeCopyVariant = 'github' | 'discord'

type PlatformOption = {
  id: PlatformMode
  label: string
  description: string
}

type InlineToken = {
  kind: TokenKind
  text: string
}

type PreparedMarkdown = {
  text: string
  tokens: InlineToken[]
}

const STORAGE_KEYS = {
  draft: 'echo-md:draft:v1',
  platform: 'echo-md:platform:v1',
  theme: 'echo-md:theme:v1',
  previewTheme: 'echo-md:preview-theme:v1',
  layout: 'echo-md:layout:v1',
} as const

const SAMPLE_MARKDOWN = `# Launch checklist

Write once. **Preview everywhere.** Use Echo to check the final feel before you paste.

This draft includes a [project link](https://github.com/zxyandreay/echo-md), *emphasis*, **bold text**, and ~~strikethrough~~.

## Tasks

- [x] Draft the announcement
- [ ] Preview it on each platform
- [ ] Share the final copy

> Markdown changes shape from app to app. Echo helps you catch the visual surprises first.

Use \`npm run build\` before publishing.

\`\`\`ts
type Platform = 'GitHub' | 'Discord' | 'Reddit'

const message = 'Preview before you post'
\`\`\`

| Platform | Watch for |
| --- | --- |
| GitHub | Tables, task lists, README spacing |
| Discord | Chat rhythm, spoilers, code blocks |
| Reddit | Post spacing, quotes, action rows |

Discord spoiler: ||hidden launch note||

Reddit spoiler: >!hidden launch note!<`

const EDITOR_PLACEHOLDER = `# Start your draft

Write Markdown here and Echo will preview it for each platform.

- Try a list
- Add \`inline code\`
- Paste a table
- Test ||Discord spoilers|| or >!Reddit spoilers!<`

const PLATFORM_OPTIONS: PlatformOption[] = [
  {
    id: 'github',
    label: 'GitHub',
    description: 'README-style GFM preview',
  },
  {
    id: 'discord',
    label: 'Discord',
    description: 'Message-style Markdown preview',
  },
  {
    id: 'reddit',
    label: 'Reddit',
    description: 'Post/comment-style preview',
  },
]

const layoutOptions: Array<{
  id: LayoutMode
  label: string
  icon: typeof Columns2
}> = [
  { id: 'split', label: 'Split layout', icon: Columns2 },
  { id: 'editor', label: 'Editor only', icon: PanelLeft },
  { id: 'preview', label: 'Preview only', icon: PanelRight },
]

const tokenPattern = /ECHO_TOKEN_(\d+)_END/g

function isPlatformMode(value: unknown): value is PlatformMode {
  return value === 'github' || value === 'discord' || value === 'reddit'
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}

function isLayoutMode(value: unknown): value is LayoutMode {
  return value === 'split' || value === 'editor' || value === 'preview'
}

function readStorageValue<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => value is T,
): T {
  try {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue === null) {
      return fallback
    }

    const parsedValue = JSON.parse(storedValue) as unknown

    if (validate && !validate(parsedValue)) {
      return fallback
    }

    return parsedValue as T
  } catch {
    return fallback
  }
}

function useStoredState<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() =>
    readStorageValue(key, fallback, validate),
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Local persistence is a convenience; the editor should still work.
    }
  }, [key, value])

  return [value, setValue] as const
}

function addToken(tokens: InlineToken[], kind: TokenKind, text: string) {
  const token = `ECHO_TOKEN_${tokens.length}_END`
  tokens.push({ kind, text })
  return token
}

function prepareDiscordMarkdown(markdown: string): PreparedMarkdown {
  const tokens: InlineToken[] = []
  const text = markdown
    .replace(/\|\|([\s\S]+?)\|\|/g, (_, value: string) =>
      addToken(tokens, 'spoiler', value),
    )
    .replace(/__([^_\n][\s\S]*?)__/g, (_, value: string) =>
      addToken(tokens, 'underline', value),
    )
    .replace(/~~([\s\S]+?)~~/g, (_, value: string) =>
      addToken(tokens, 'strike', value),
    )

  return { text, tokens }
}

function prepareRedditMarkdown(markdown: string): PreparedMarkdown {
  const tokens: InlineToken[] = []
  const text = markdown.replace(/>!([\s\S]+?)!</g, (_, value: string) =>
    addToken(tokens, 'spoiler', value),
  )

  return { text, tokens }
}

function renderToken(token: InlineToken, key: string) {
  if (token.kind === 'spoiler') {
    return (
      <span className="inline-spoiler" key={key}>
        {token.text}
      </span>
    )
  }

  if (token.kind === 'underline') {
    return (
      <span className="inline-underline" key={key}>
        {token.text}
      </span>
    )
  }

  return (
    <span className="inline-strike" key={key}>
      {token.text}
    </span>
  )
}

function renderTokenizedText(value: string, tokens: InlineToken[]) {
  const pieces: ReactNode[] = []
  let lastIndex = 0

  for (const match of value.matchAll(tokenPattern)) {
    const tokenIndex = Number(match[1])
    const token = tokens[tokenIndex]

    if (match.index === undefined || !token) {
      continue
    }

    if (match.index > lastIndex) {
      pieces.push(value.slice(lastIndex, match.index))
    }

    pieces.push(renderToken(token, `${token.kind}-${tokenIndex}-${match.index}`))
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < value.length) {
    pieces.push(value.slice(lastIndex))
  }

  return pieces.length > 0 ? pieces : value
}

function renderTokenizedChildren(children: ReactNode, tokens: InlineToken[]) {
  if (typeof children === 'string') {
    return renderTokenizedText(children, tokens)
  }

  if (Array.isArray(children)) {
    return children.flatMap((child, index) => {
      if (typeof child === 'string') {
        return renderTokenizedText(child, tokens)
      }

      return <span key={`child-${index}`}>{child}</span>
    })
  }

  return children
}

function extractTextFromReactNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join('')
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractTextFromReactNode(node.props.children)
  }

  return ''
}

function PlatformCodeBlock({
  children,
  code,
  variant,
}: {
  children: ReactNode
  code: string
  variant: CodeCopyVariant
}) {
  const [copied, setCopied] = useState(false)
  const resetTimerRef = useRef<number | null>(null)
  const label = copied ? 'Copied' : 'Copy'
  const Icon = copied ? Check : Copy

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  async function copyCode() {
    if (!code) {
      return
    }

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`preview-code-block preview-code-block-${variant}`}>
      <button
        aria-label={`${label} code block`}
        className="code-copy-button"
        data-copied={copied}
        data-render-control
        onClick={copyCode}
        title={`${label} code`}
        type="button"
      >
        <Icon aria-hidden="true" size={15} />
        <span className="code-copy-label">{label}</span>
      </button>
      <pre>{children}</pre>
    </div>
  )
}

function renderPlatformChildren(children: ReactNode, tokens?: InlineToken[]) {
  return tokens ? renderTokenizedChildren(children, tokens) : children
}

function createMarkdownComponents({
  codeCopyVariant,
  tokens,
}: {
  codeCopyVariant?: CodeCopyVariant
  tokens?: InlineToken[]
} = {}): Components {
  return {
    a({ href, children, title }) {
      return (
        <a href={href} rel="noreferrer" target="_blank" title={title}>
          {renderPlatformChildren(children, tokens)}
        </a>
      )
    },
    blockquote({ children }) {
      return <blockquote>{renderPlatformChildren(children, tokens)}</blockquote>
    },
    h1({ children }) {
      return <h1>{renderPlatformChildren(children, tokens)}</h1>
    },
    h2({ children }) {
      return <h2>{renderPlatformChildren(children, tokens)}</h2>
    },
    h3({ children }) {
      return <h3>{renderPlatformChildren(children, tokens)}</h3>
    },
    h4({ children }) {
      return <h4>{renderPlatformChildren(children, tokens)}</h4>
    },
    li({ children }) {
      return <li>{renderPlatformChildren(children, tokens)}</li>
    },
    p({ children }) {
      return <p>{renderPlatformChildren(children, tokens)}</p>
    },
    pre({ children }) {
      if (!codeCopyVariant) {
        return <pre>{children}</pre>
      }

      return (
        <PlatformCodeBlock
          code={extractTextFromReactNode(children).replace(/\n$/, '')}
          variant={codeCopyVariant}
        >
          {children}
        </PlatformCodeBlock>
      )
    },
    img({ alt, src, title }) {
      return <img alt={alt ?? ''} loading="lazy" src={src} title={title} />
    },
  }
}

const githubMarkdownComponents = createMarkdownComponents({
  codeCopyVariant: 'github',
})

function GitHubPreview({
  markdown,
  previewTheme,
}: {
  markdown: string
  previewTheme: PreviewThemeMode
}) {
  if (!markdown.trim()) {
    return <EmptyPreview platform="GitHub" previewTheme={previewTheme} />
  }

  return (
    <div className={`github-preview platform-preview-${previewTheme}`}>
      <article className="markdown-body">
        <Markdown
          components={githubMarkdownComponents}
          remarkPlugins={[remarkGfm]}
          skipHtml
        >
          {markdown}
        </Markdown>
      </article>
    </div>
  )
}

function DiscordPreview({
  markdown,
  previewTheme,
}: {
  markdown: string
  previewTheme: PreviewThemeMode
}) {
  const preparedMarkdown = useMemo(
    () => prepareDiscordMarkdown(markdown),
    [markdown],
  )
  const components = useMemo(
    () =>
      createMarkdownComponents({
        codeCopyVariant: 'discord',
        tokens: preparedMarkdown.tokens,
      }),
    [preparedMarkdown.tokens],
  )

  if (!markdown.trim()) {
    return <EmptyPreview platform="Discord" previewTheme={previewTheme} />
  }

  return (
    <div className={`discord-preview platform-preview-${previewTheme}`}>
      <div className="discord-message">
        <div className="discord-avatar" aria-hidden="true">
          E
        </div>
        <div className="discord-message-main">
          <div className="discord-meta">
            <span className="discord-name">echo.writer</span>
            <span className="discord-time">Today at 10:24 PM</span>
          </div>
          <div className="discord-markdown">
            <Markdown
              components={components}
              remarkPlugins={[remarkBreaks]}
              skipHtml
            >
              {preparedMarkdown.text}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  )
}

function RedditPreview({
  markdown,
  previewTheme,
}: {
  markdown: string
  previewTheme: PreviewThemeMode
}) {
  const preparedMarkdown = useMemo(
    () => prepareRedditMarkdown(markdown),
    [markdown],
  )
  const components = useMemo(
    () => createMarkdownComponents({ tokens: preparedMarkdown.tokens }),
    [preparedMarkdown.tokens],
  )

  if (!markdown.trim()) {
    return <EmptyPreview platform="Reddit" previewTheme={previewTheme} />
  }

  return (
    <div className={`reddit-preview platform-preview-${previewTheme}`}>
      <article className="reddit-card">
        <div className="reddit-votes" aria-hidden="true">
          <span>up</span>
          <strong>128</strong>
          <span>down</span>
        </div>
        <div className="reddit-post">
          <div className="reddit-meta">
            <span>r/markdown</span>
            <span>Posted by u/echo_writer</span>
            <span>just now</span>
          </div>
          <div className="reddit-markdown">
            <Markdown
              components={components}
              remarkPlugins={[remarkGfm]}
              skipHtml
            >
              {preparedMarkdown.text}
            </Markdown>
          </div>
          <div className="reddit-actions" aria-label="Reddit action preview">
            <span>12 Comments</span>
            <span>Share</span>
            <span>Save</span>
          </div>
        </div>
      </article>
    </div>
  )
}

function EmptyPreview({
  platform,
  previewTheme,
}: {
  platform: string
  previewTheme: PreviewThemeMode
}) {
  return (
    <div className={`empty-preview platform-preview-${previewTheme}`}>
      <FileText aria-hidden="true" size={26} strokeWidth={1.8} />
      <h2>{platform} preview is ready</h2>
      <p>Start writing Markdown or load the sample to see the styled preview.</p>
    </div>
  )
}

function PlatformPreview({
  markdown,
  platform,
  previewTheme,
}: {
  markdown: string
  platform: PlatformMode
  previewTheme: PreviewThemeMode
}) {
  if (platform === 'discord') {
    return <DiscordPreview markdown={markdown} previewTheme={previewTheme} />
  }

  if (platform === 'reddit') {
    return <RedditPreview markdown={markdown} previewTheme={previewTheme} />
  }

  return <GitHubPreview markdown={markdown} previewTheme={previewTheme} />
}

function App() {
  const [markdown, setMarkdown] = useStoredState(
    STORAGE_KEYS.draft,
    SAMPLE_MARKDOWN,
  )
  const [platform, setPlatform] = useStoredState<PlatformMode>(
    STORAGE_KEYS.platform,
    'github',
    isPlatformMode,
  )
  const [theme, setTheme] = useStoredState<ThemeMode>(
    STORAGE_KEYS.theme,
    'light',
    isThemeMode,
  )
  const [previewTheme, setPreviewTheme] = useStoredState<PreviewThemeMode>(
    STORAGE_KEYS.previewTheme,
    'light',
    isThemeMode,
  )
  const [layout, setLayout] = useStoredState<LayoutMode>(
    STORAGE_KEYS.layout,
    'split',
    isLayoutMode,
  )
  const [notice, setNotice] = useState('Draft saved locally')
  const previewRef = useRef<HTMLDivElement>(null)
  const noticeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current)
      }
    }
  }, [])

  const selectedPlatform = PLATFORM_OPTIONS.find(
    (option) => option.id === platform,
  )
  const showEditor = layout !== 'preview'
  const showPreview = layout !== 'editor'

  function showNotice(message: string) {
    setNotice(message)

    if (noticeTimerRef.current !== null) {
      window.clearTimeout(noticeTimerRef.current)
    }

    noticeTimerRef.current = window.setTimeout(() => {
      setNotice('Draft saved locally')
    }, 2400)
  }

  async function copyMarkdown() {
    if (!markdown) {
      showNotice('Nothing to copy yet')
      return
    }

    try {
      await navigator.clipboard.writeText(markdown)
      showNotice('Markdown copied')
    } catch {
      showNotice('Clipboard access was blocked')
    }
  }

  async function copyRenderedHtml() {
    const previewClone = previewRef.current?.cloneNode(true) as
      | HTMLElement
      | undefined

    previewClone
      ?.querySelectorAll('[data-render-control]')
      .forEach((element) => element.remove())

    const html = previewClone?.innerHTML ?? ''
    const text = previewClone?.innerText ?? ''

    if (!html && !text) {
      showNotice('Nothing to copy yet')
      return
    }

    try {
      if (window.ClipboardItem && navigator.clipboard.write && html) {
        const item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        })

        await navigator.clipboard.write([item])
      } else {
        await navigator.clipboard.writeText(text || html)
      }

      showNotice('Rendered preview copied')
    } catch {
      try {
        await navigator.clipboard.writeText(text || html)
        showNotice('Rendered text copied')
      } catch {
        showNotice('Clipboard access was blocked')
      }
    }
  }

  function clearEditor() {
    setMarkdown('')
    showNotice('Editor cleared')
  }

  function loadSample() {
    setMarkdown(SAMPLE_MARKDOWN)
    showNotice('Sample loaded')
  }

  return (
    <main className={`app-shell theme-${theme}`}>
      <header className="topbar">
        <div className="brand-cluster">
          <div className="brand-mark" aria-hidden="true">
            E
          </div>
          <div>
            <p className="brand-name">Echo</p>
            <h1>Write once. Preview everywhere.</h1>
            <p>Preview Markdown before you post.</p>
          </div>
        </div>

        <div className="topbar-actions">
          <p className="approximation-note">
            Platform previews are approximations and may differ slightly from
            the actual apps.
          </p>
          <button
            className="icon-button"
            onClick={() =>
              setTheme((currentTheme) =>
                currentTheme === 'light' ? 'dark' : 'light',
              )
            }
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            type="button"
          >
            {theme === 'light' ? (
              <Moon aria-hidden="true" size={18} />
            ) : (
              <Sun aria-hidden="true" size={18} />
            )}
            <span className="sr-only">
              Switch to {theme === 'light' ? 'dark' : 'light'} theme
            </span>
          </button>
        </div>
      </header>

      <section className="command-bar" aria-label="Editor controls">
        <div className="platform-tabs" role="tablist" aria-label="Preview mode">
          {PLATFORM_OPTIONS.map((option) => (
            <button
              aria-selected={platform === option.id}
              className="platform-tab"
              key={option.id}
              onClick={() => setPlatform(option.id)}
              role="tab"
              type="button"
            >
              <span>{option.label}</span>
              <small>{option.description}</small>
            </button>
          ))}
        </div>

        <div className="toolbar">
          <button className="tool-button" onClick={copyMarkdown} type="button">
            <Clipboard aria-hidden="true" size={16} />
            Copy Markdown
          </button>
          <button
            className="tool-button"
            onClick={copyRenderedHtml}
            type="button"
          >
            <Code2 aria-hidden="true" size={16} />
            Copy HTML
          </button>
          <button className="tool-button" onClick={loadSample} type="button">
            <RotateCcw aria-hidden="true" size={16} />
            Load Sample
          </button>
          <button className="tool-button danger" onClick={clearEditor} type="button">
            <Trash2 aria-hidden="true" size={16} />
            Clear
          </button>
        </div>
      </section>

      <section className="workspace-meta" aria-label="Workspace status">
        <div className="workspace-controls">
          <div className="layout-toggle" aria-label="Layout mode">
            {layoutOptions.map((option) => {
              const Icon = option.icon

              return (
                <button
                  aria-pressed={layout === option.id}
                  className="layout-button"
                  key={option.id}
                  onClick={() => setLayout(option.id)}
                  title={option.label}
                  type="button"
                >
                  <Icon aria-hidden="true" size={16} />
                  <span className="sr-only">{option.label}</span>
                </button>
              )
            })}
          </div>

          <div className="preview-theme-toggle" aria-label="Platform preview theme">
            <span>Preview theme</span>
            <button
              aria-pressed={previewTheme === 'light'}
              className="preview-theme-button"
              onClick={() => setPreviewTheme('light')}
              title="Use light platform preview"
              type="button"
            >
              <Sun aria-hidden="true" size={15} />
              Light
            </button>
            <button
              aria-pressed={previewTheme === 'dark'}
              className="preview-theme-button"
              onClick={() => setPreviewTheme('dark')}
              title="Use dark platform preview"
              type="button"
            >
              <Moon aria-hidden="true" size={15} />
              Dark
            </button>
          </div>
        </div>
        <p className="status-text">{notice}</p>
      </section>

      <section className={`workspace layout-${layout}`}>
        {showEditor ? (
          <section className="panel editor-panel" aria-labelledby="editor-title">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Editor</p>
                <h2 id="editor-title">Markdown draft</h2>
              </div>
              <span>{markdown.length.toLocaleString()} chars</span>
            </div>
            <textarea
              aria-label="Markdown editor"
              className="markdown-editor"
              onChange={(event) => setMarkdown(event.target.value)}
              placeholder={EDITOR_PLACEHOLDER}
              spellCheck="false"
              value={markdown}
            />
          </section>
        ) : null}

        {showPreview ? (
          <section className="panel preview-panel" aria-labelledby="preview-title">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Preview</p>
                <h2 id="preview-title">
                  {selectedPlatform?.label ?? 'GitHub'} style
                </h2>
              </div>
              <span>{selectedPlatform?.description}</span>
            </div>
            <div
              className={`preview-scroll preview-scroll-${previewTheme}`}
              ref={previewRef}
            >
              <PlatformPreview
                markdown={markdown}
                platform={platform}
                previewTheme={previewTheme}
              />
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}

export default App
