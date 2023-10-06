const { DEFAULT_SCHEMA, Type, load } = require('js-yaml')
const { marked } = require('marked')
marked.use({
  gfm: true,
})

module.exports = {
  process: function (sourceText, sourcePath, config, options) {
    const result = load(sourceText, {
      schema: DEFAULT_SCHEMA.extend(
        new Type('tag:yaml.org,2002:text/markdown', {
          kind: 'scalar',
          construct: (data) => {
            // We only currently use !!text/markdown within yaml for out locales/i18n text
            // for which we use FormatJS under the hood. FormatJS requires you to escape any XML/HTML looking
            // things, plus ICU '{' and '}', hence this replace.
            // If we ever need !!text/markdown for anything else we should do something like !!text/icu+markdown
            return marked(data).replace(/</g, "'<'")
              .replace(/%7B/g, '{')
              .replace(/%7D/g, '}')
          },
        }),
      ),
    })
    const json = JSON.stringify(result, undefined, '\t')
    return {
      code: `module.exports = ${json}`,
      map: null,
    }
  },
}
