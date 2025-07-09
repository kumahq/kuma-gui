import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import markdown from 'markdown-it'

export const yamlLoaderPluginConfig = () => {
  const md = markdown(
    {
      html: true,
    },
  )
  return { 
    schema: DEFAULT_SCHEMA.extend(
      new Type('tag:yaml.org,2002:text/markdown', {
        kind: 'scalar',
        construct: (data) => {
        // We only currently use !!text/markdown within yaml for out locales/i18n text
        // for which we use FormatJS under the hood. FormatJS requires you to escape any XML/HTML looking
        // things, plus ICU '{' and '}', hence this replace.
        // If we ever need !!text/markdown for anything else we should do something like !!text/icu+markdown
          const str = md.render(data)

          return str.replace(/</g, "'<'")
            .replace(/%7B/g, '{')
            .replace(/%7D/g, '}')
        },
      }),
    ),
  }
}

export const vuePluginConfig = () => ({
  template: {
    compilerOptions: {
      whitespace: 'preserve' as const,
      isCustomElement: (item: string) => [
        'search',
      ].includes(item),
    },
  },
})
