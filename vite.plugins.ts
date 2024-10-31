import { readFile, stat } from 'fs/promises'
import { dirname } from 'path'

import type { KumaHtmlVars } from '@/app/application/services/env/Env'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

const cwd = process.cwd()
const read = async (path: string) => (await readFile(`${cwd}/${path}`)).toString()
const version = JSON.parse((await read('./package.json'))).version
export const htmlVars = {
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
  } catch (e) {
    return false
  }
}
const interpolate = (template: string, vars: KumaHtmlVars) => {
  return template
    .replace('{{.BaseGuiPath}}', '/gui')
    .replace('{{.}}', JSON.stringify(vars))
}
export const kumaIndexHtmlVars = (): Plugin => {
  return {
    // replace the `{{.}}` with dev vars
    // reproducing what the kuma binary does
    name: 'kuma-index-html-vars',
    transformIndexHtml: (template) => interpolate(template, htmlVars),
  }
}
const server = (template: string = './index.html', vars: Partial<KumaHtmlVars> = {}) => async (server: PreviewServer | ViteDevServer) => {
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

      const body = interpolate(
        await read(template),
        {
          ...htmlVars,
          ...vars,
          ...Object.fromEntries(Object.entries({
            version: cookies.KUMA_VERSION,
            mode: cookies.KUMA_MODE,
            environment: cookies.KUMA_ENVIRONMENT,
            storeType: cookies.KUMA_STORE_TYPE,
          }).filter(([_, value]) => typeof value !== 'undefined')),
        } satisfies KumaHtmlVars,
      )
      res.end(body)
    } else {
      next()
    }
  })

}
export const replicateKumaServer = (...args: Parameters<typeof server>): Plugin => {
  return {
    name: 'replicateKumaServer',
    configureServer: server(...args),
    configurePreviewServer: server(...args),
  }
}
