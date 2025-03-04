// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'

import { highlightElement, AvailableLanguages } from './highlightElement'

const highlightElementTextCases: Array<[{ language: AvailableLanguages, code: string }, string]> = [
  [
    {
      language: 'json',
      code: `{
        "key": "value"
      }`,
    },
    '.token.punctuation',
  ],
  [
    {
      language: 'yaml',
      code: 'key: value',
    },
    '.token.key.atrule',
  ],
  [
    {
      language: 'bash',
      code: 'echo "hello"',
    },
    '.token.builtin.class-name',
  ],
]

describe('highlightElement', () => {
  test.each(highlightElementTextCases)('handles available languages', ({ language, code }, expectedSelector) => {
    const preElement = document.createElement('pre')
    const codeElement = document.createElement('code')
    preElement.appendChild(codeElement)

    highlightElement(code, language)

    expect(preElement.classList.contains(`language-${language}`)).toBe(true)
    expect(codeElement.classList.contains(`language-${language}`)).toBe(true)

    // Verifies that the Prism syntax highlighting is working
    const token = codeElement.querySelector(expectedSelector)
    expect(token instanceof HTMLElement).toBe(true)
  })
})
