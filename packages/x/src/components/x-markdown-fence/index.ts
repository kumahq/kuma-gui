import type { MarkdownIt } from 'markdown-it'
export const markdownFence = (md: MarkdownIt) => {
  md.renderer.rules.fence = (tokens, idx) => {
    const { info, content } = tokens[idx]
    const language = md.utils.escapeHtml(info.trim().split(/\s+/)[0] ?? '')
    // the code is the content of the element, so don't add any whitespace of
    // our own here, it would end up in the code itself.
    // markdown-it always terminates fence content with a newline
    const code = md.utils.escapeHtml(content.replace(/\n$/, ''))
    return `<x-markdown-fence language="${language}">${code}</x-markdown-fence>\n`
  }
}
