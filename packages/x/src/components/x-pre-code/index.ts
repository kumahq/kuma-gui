import type { MarkdownIt } from 'markdown-it'
export const markdownFence = (md: MarkdownIt) => {
  md.renderer.rules.fence = (tokens, idx) => {
    const { info, content } = tokens[idx]
    const language = md.utils.escapeHtml(info.trim().split(/\s+/)[0] ?? '')
    // NOTE(llm): without a shadow root Vue removes the element's children
    // before setup, so we pass the code as an attribute rather than as content.
    // markdown-it always terminates fence content with a newline
    const code = md.utils.escapeHtml(content.replace(/\n$/, ''))
    return `<x-pre-code language="${language}" code="${code}"></x-pre-code>\n`
  }
}
