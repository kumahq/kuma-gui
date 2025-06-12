import { readFile, stat } from 'fs/promises'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import markdown from 'markdown-it'
import crypto from 'node:crypto'
import { dirname } from 'path'

import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

const cwd = process.cwd()
const read = async (path: string) => (await readFile(`${cwd}/${path}`)).toString()

export type KumaHtmlVars = {
  baseGuiPath: string
  apiUrl: string
  version: string
  product: string
  mode: string
  zone?: string
  environment: string
  storeType: string
  apiReadOnly: boolean
}
export const yamlSchema = () => {
  const md = markdown(
    {
      html: true,
    },
  )
  return DEFAULT_SCHEMA.extend(
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
  )
}




const exists = async (path: string) => {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}
const interpolate = (template: string, vars: KumaHtmlVars) => {
  return template
    .replace('{{.BaseGuiPath}}', '/gui')
    .replace('{{.}}', JSON.stringify(vars))
}
export const kumaIndexHtmlVars = (vars: KumaHtmlVars): Plugin => {
  return {
    // replace the `{{.}}` with dev vars
    // reproducing what the kuma binary does
    name: 'kuma-index-html-vars',
    transformIndexHtml: (template) => interpolate(template, vars),
  }
}
const server = (
  vars: KumaHtmlVars,
  template: string = './index.html',
  csp: boolean = true,
) => async (server: PreviewServer | ViteDevServer) => {
  server.middlewares.use('/', async (req, res, next) => {
    const url = req.originalUrl || ''
    const baseGuiPath = vars.baseGuiPath || '/gui'
    const path = `${dirname(template).replace(baseGuiPath, '')}${url}`
    if ((url === '/' || url.startsWith(`${baseGuiPath}/`)) && !await exists(path)) {

      const cookies = (req.headers?.cookie ?? '').split(';')
        .map((item) => item.trim())
        .filter((item) => item !== '')
        .reduce((prev, item) => {
          const [key, value] = item.split('=')
          prev[key] = value
          return prev
        }, {} as Record<string, string>)

      // we create a totally new index.html from our template here
      // so anything added by Vite that is not in our index.html template
      // will be removed. Ideally we would take vites output and use that as the template
      // but its not clear how to get vites output from within this middleware
      let body = interpolate(
        await read(template),
        {
          ...vars,
          ...Object.fromEntries(Object.entries({
            version: cookies.KUMA_VERSION,
            mode: cookies.KUMA_MODE,
            environment: cookies.KUMA_ENVIRONMENT,
            storeType: cookies.KUMA_STORE_TYPE,
          }).filter(([_, value]) => typeof value !== 'undefined')),
        } satisfies KumaHtmlVars,
      )

      if (csp) {
        const nonce = crypto.randomBytes(16).toString('base64')
        body = body.replace('<meta charset="utf-8" />', `<meta charset="utf-8" /><meta property="csp-nonce" nonce="${nonce}">`)
        res.setHeader('Content-Security-Policy', [
          "default-src 'self'",
          "script-src 'self'",
          "script-src-elem 'self'",
          "img-src 'self' data: ",
          // in a production environment the nonce is not required
          // its only used for vite dev-time live reloading client
          // the sha256 _will be_ required
          // 'sha256-UtFm94bwcb1Z4CU0svC29YMU26pP5RoZDN8zoniSJhU=' 'sha256-qo7STIM1L/OgU9y0De47mqod1UZFLJfTn36bRC42rfA=' 'nonce-${nonce}'
          "style-src 'self' 'unsafe-inline'",
          // in production connect-src would use kuma's environment variable for
          // setting the location of the HTTP API (or just use the default)
          "connect-src 'self' localhost:5681 https://kuma.io",
        ].join(';'))
      }
      res.end(body)
    } else {
      next()
    }
  })

}
export const replicateKumaServer = (
  vars: KumaHtmlVars,
  template: string = './index.html',
  csp: boolean = true,
): Plugin => {
  const plugin = {
    name: 'replicateKumaServer',
    config: (_: unknown, { mode }: { mode: string }) => {
      switch (mode) {
        case 'preview': {
          const { name, ...rest } = kumaIndexHtmlVars(vars)
          Object.assign(plugin, rest)
          break
        }
      }
    },
    configureServer: server(vars, template, csp),
    configurePreviewServer: server(vars, template, csp),
  }
  return plugin
}
