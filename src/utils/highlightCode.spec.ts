import { highlightCode } from './highlightCode'

describe('highlightCode', () => {
  test.each([
    [
      {
        language: 'json',
        code: '{}',
      },
      'token punctuation',
    ],
    [
      {
        language: 'yaml',
        code: 'key: value',
      },
      'token key',
    ],
    [
      {
        language: 'bash',
        code: 'echo "hello"',
      },
      'token builtin',
    ],
    [
      {
        language: 'plaintext',
        code: 'Hello, world!',
      },
      'Hello, world!',
    ],
  ])('handles available languages', ({ language, code }, expectedSubString) => {
    const highlightedCode = highlightCode(code, language)

    expect(highlightedCode).toContain(expectedSubString)
  })

  test('renders plaintext on unknown language and doesn’t throw', () => {
    const code = 'print("Hello, world!")'
    const highlightedCode = highlightCode(code, 'python')

    expect(highlightedCode).toBe(code)
  })
})
