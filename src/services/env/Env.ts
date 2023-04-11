import { getPathConfigDefault } from '@/pathConfigDefault'
import { PathConfig } from '@/types/index'

export type EnvArgs = {
  KUMA_PRODUCT_NAME: string
  KUMA_FEEDBACK_URL: string
  KUMA_CHAT_URL: string
  KUMA_INSTALL_URL: string
  KUMA_VERSION_URL: string
  KUMA_DOCS_URL: string
  KUMA_MOCK_API_ENABLED: string
}
type EnvProps = {
  KUMA_VERSION: string
  KUMA_BASE_PATH: string
  KUMA_API_URL: string
  KUMA_UTM_QUERY_PARAMS: string
}
export type EnvVars = EnvArgs & EnvProps

type EnvInternal = EnvArgs & Partial<EnvProps>
export default class Env {
  env: EnvVars | undefined
  constructor(envArgs: EnvArgs) {
    let _env: EnvInternal = envArgs
    const env = (str: keyof EnvInternal, d: string = '') => this.var(str, _env?.[str] ?? d)

    const config = this.getConfig()
    const version = semver(env('KUMA_VERSION', config.version))

    const productName = encodeURIComponent(env('KUMA_PRODUCT_NAME'))
    _env = {
      ..._env,
      KUMA_UTM_QUERY_PARAMS: `utm_source=${productName}&utm_medium=${productName}`,
    }
    this.env = {
      ..._env as EnvVars,
      KUMA_INSTALL_URL: `${env('KUMA_INSTALL_URL')}?${env('KUMA_UTM_QUERY_PARAMS')}`,
      // TODO(jc): not totally sure we need to use a regex here, maybe just split and join if not
      KUMA_DOCS_URL: `${env('KUMA_DOCS_URL')}/${version.patch === '0.0.0' ? 'dev' : version.patch.replace(/\.\d+$/, '.x')}`,
      KUMA_VERSION: version.pre,
      KUMA_API_URL: env('KUMA_API_URL') || config.apiUrl,
      KUMA_BASE_PATH: env('KUMA_BASE_PATH') || config.baseGuiPath,
    }
  }

  var(key: keyof EnvVars, d: string = '') {
    return this.env?.[key] ?? d
  }

  /**
   * Reads the path config object from a JSON string found in a special script
   * tag that’s populated during server-side rendering of the Vue application’s
   * index.html file.
   */
  protected getConfig(): PathConfig {
    const pathConfigNode = document.querySelector('#kuma-config')

    // Falls back to a sensible default when encountering a malformed JSON
    // payload or non-replaced template, or during CLI tests when there is no
    // HTML file.

    // TODO: Uncomment noisy console errors (we don't want them during testing
    // but we do want them for our users)
    let config!: PathConfig
    if (pathConfigNode instanceof HTMLScriptElement && pathConfigNode.textContent) {
      try {
        config = JSON.parse(pathConfigNode.textContent.trim())
      } catch {
        // Handled by falling back to a default value.
      }
    }
    if (!config) {
      config = getPathConfigDefault(import.meta.env.PROD ? '' : import.meta.env.VITE_KUMA_API_SERVER_URL)
    // console.error('Unable to parse kuma config. Falling back to defaults')
    }
    // Ensures the API baseUrl always has an absolute, non-trailing slash URL,
    // i.e. a base.
    // Chosen to be done here as this is the closest point to the backend we
    // can get
    config.apiUrl = normalizeBaseUrl(config.apiUrl)
    return config
  }
}
function stripTrailingSlashes(url: string): string {
  return url.endsWith('/') ? stripTrailingSlashes(url.slice(0, -1)) : url
}
export function normalizeBaseUrl(url: string): string {
  // this will likely never happen but if the URL isn't absolute then
  // make sure it begins with a `/`
  url = !url.includes('://') && !url.startsWith('/') ? `/${url}` : url
  return stripTrailingSlashes(url)
}

export function semver(version: string): { major: string, minor: string, patch: string, pre: string } {
  const [major, minor, ...patchPre] = version.split('.')
  if (isNaN(parseInt(major))) {
    return {
      major,
      minor: major,
      patch: major,
      pre: major,
    }
  }
  const [patch, pre] = patchPre.join('.').split('-')
  return {
    major,
    minor: `${major}.${minor}`,
    patch: `${major}.${minor}.${patch}`,
    pre: `${major}.${minor}.${patch}${pre !== undefined ? `-${pre}` : ''}`,
  }
}
