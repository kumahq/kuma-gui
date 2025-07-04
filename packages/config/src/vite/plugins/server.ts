import { readFile, stat } from 'fs/promises'
import crypto from 'node:crypto'
import { dirname } from 'path'

import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

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
type ServerOptions = {
  template: string
  vars: Partial<KumaHtmlVars>
  csp: Partial<{ enabled: boolean } & Record<CspDirective, string>>
}
type CspDirective = 'default-src' | 'script-src' | 'script-src-elem' | 'img-src' | 'style-src' | 'connect-src'

const cwd = process.cwd()
const read = async (path: string) => (await readFile(`${cwd}/${path}`)).toString()
const version = JSON.parse((await read('./package.json'))).version

export const defaultKumaHtmlVars = {
  baseGuiPath: '/gui',
  apiUrl: 'http://localhost:5681',
  version,
  product: 'Kuma', // we no longer use this, it can be removed in the backend
  mode: 'global',
  environment: 'universal',
  storeType: 'postgres',
  apiReadOnly: false,
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
export const kumaIndexHtmlVars = (htmlVars: Partial<KumaHtmlVars> = {}): Plugin => {
  return {
    // replace the `{{.}}` with dev vars
    // reproducing what the kuma binary does
    name: 'kuma-index-html-vars',
    transformIndexHtml: (template) => interpolate(template, { ...defaultKumaHtmlVars, ...htmlVars}),
  }
}

const server = ({
  template = './index.html',
  vars = {},
  csp = {},
}: Partial<ServerOptions> = {}) => async (server: PreviewServer | ViteDevServer) => {
  const { enabled: isCspEnabled = true } = csp
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
          ...defaultKumaHtmlVars,
          ...vars,
          ...Object.fromEntries(Object.entries({
            version: cookies.KUMA_VERSION,
            mode: cookies.KUMA_MODE,
            environment: cookies.KUMA_ENVIRONMENT,
            storeType: cookies.KUMA_STORE_TYPE,
          }).filter(([_, value]) => typeof value !== 'undefined')),
        } satisfies KumaHtmlVars,
      )

      if (isCspEnabled) {
        const nonce = crypto.randomBytes(16).toString('base64')
        body = body.replace('<meta charset="utf-8" />', `<meta charset="utf-8" /><meta property="csp-nonce" nonce="${nonce}">`)
        res.setHeader('Content-Security-Policy', [
          `default-src 'self'${csp['default-src'] ? ` ${csp['default-src']}` : ''}`,
          `script-src 'self'${csp['script-src'] ? ` ${csp['script-src']}` : ''}`,
          `script-src-elem 'self'${csp['script-src-elem'] ? ` ${csp['script-src-elem']}` : ''}`,
          `img-src 'self' data: ${csp['img-src'] ? ` ${csp['img-src']}` : ''}`,
          // in a production environment the nonce is not required
          // its only used for vite dev-time live reloading client
          // the sha256 _will be_ required
          // 'sha256-UtFm94bwcb1Z4CU0svC29YMU26pP5RoZDN8zoniSJhU=' 'sha256-qo7STIM1L/OgU9y0De47mqod1UZFLJfTn36bRC42rfA=' 'nonce-${nonce}'
          `style-src 'self' 'unsafe-inline'${csp['style-src'] ? ` ${csp['style-src']}` : ''}`,
          // in production connect-src would use kuma's environment variable for
          // setting the location of the HTTP API (or just use the default)
          `connect-src 'self' localhost:5681 https://kuma.io${csp['connect-src'] ? ` ${csp['connect-src']}` : ''}`,
        ].join(';'))
      }
      res.end(body)
    } else {
      next()
    }
  })

}
export const replicateKumaServer = (options: Partial<ServerOptions> = {}): Plugin => {
  const plugin = {
    name: 'replicateKumaServer',
    config: (_: unknown, { mode }: { mode: string }) => {
      switch (mode) {
        case 'preview': {
          const { name, ...rest } = kumaIndexHtmlVars(options.vars)
          Object.assign(plugin, rest)
          break
        }
      }
    },
    configureServer: server(options),
    configurePreviewServer: server(options),
  }
  return plugin
}
