import { shallowMount } from '@vue/test-utils'

import CodeBlock from './CodeBlock.vue'

function renderComponent(props = {}) {
  return shallowMount(CodeBlock, {
    props,
  })
}

describe('CodeBlock', () => {
  test('matches snapshot', () => {
    const wrapper = renderComponent({
      language: 'json',
      code: `
        {
          "key": "value"
        }
      `.trim(),
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  test.each([
    [
      {
        language: 'json',
        code: '{}',
      },
      'language-json',
    ],
    [
      {
        language: 'yaml',
        code: 'key: value',
      },
      'language-yaml',
    ],
    [
      {
        language: 'bash',
        code: 'echo "hello"',
      },
      'language-bash',
    ],
    [
      {
        language: 'plaintext',
        code: 'Hello, world!',
      },
      'language-plaintext',
    ],
  ])('handles available languages', (props, expectedClassName) => {
    const wrapper = renderComponent(props)

    const codeBlock = wrapper.find('[data-testid="code-block"]')

    expect(codeBlock.classes()).toEqual(['code-block__code', expectedClassName])
  })

  test('renders plaintext on unknown language', () => {
    const wrapper = renderComponent({
      language: 'python',
      code: 'print("Hello, world!")',
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
