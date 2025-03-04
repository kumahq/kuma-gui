import { createHighlighter } from 'shiki'

export type AvailableLanguages = 'plaintext' | 'bash' | 'shell' | 'json' | 'yaml'

/**
 * Syntax highlights the content of `code`.
 */
export async function highlightElement(code: string, language: AvailableLanguages): Promise<string> {
  if (!['plaintext', 'json', 'yaml', 'bash', 'shell'].includes(language)) {
    console.warn(`Prism: the language “${language}” isn't enabled.`)
  }

  const highlighter = await createHighlighter({
    langs: ['plaintext', 'json', 'yaml', 'bash', 'shell'],
    themes: ['material-theme-palenight'],
  })

  return highlighter.codeToHtml(code, {
    theme: 'material-theme-palenight',
    lang: language,
  })
}
