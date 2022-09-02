import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/themes/prism.css'

Prism.manual = true

export function highlightCode(code: string, language: string): string {
  const grammar = Prism.languages[language]

  return grammar !== undefined ? Prism.highlight(code, grammar, language) : code
}
