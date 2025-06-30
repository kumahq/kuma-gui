import yamlLoaderPlugin from '@modyfi/vite-plugin-yaml'
import vuePlugin from '@vitejs/plugin-vue'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import markdown from 'markdown-it'
import svgLoaderPlugin from 'vite-svg-loader'

import { replicateKumaServer } from './server'

export type DefinePluginOptions = {
  vue: typeof vuePlugin
  svgLoader: typeof svgLoaderPlugin
  yamlLoader: typeof yamlLoaderPlugin
  kumaServer: typeof replicateKumaServer
}

export const definePlugins = ({ vue, svgLoader, yamlLoader, kumaServer }: Partial<DefinePluginOptions>) => [
  ...(vue ? [vue({
    template: {
      compilerOptions: {
        whitespace: 'preserve',
        isCustomElement: (item) => [
          'search',
        ].includes(item),
      },
    },
  })] : []),
  ...(svgLoader ? [svgLoader()] : []),
  ...(yamlLoader ? [(() => {
    const md = markdown(
      {
        html: true,
      },
    )
    return yamlLoader({
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
    })
  })()] : []),
  ...(kumaServer ? [kumaServer()] : []),
]
