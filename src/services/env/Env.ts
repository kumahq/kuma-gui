import { getPathConfigDefault } from '@/pathConfigDefault'
import { PathConfig } from '@/types/index'

export type EnvArgs = {
  KUMA_PRODUCT_NAME: string
  KUMA_FEEDBACK_URL: string
  KUMA_CHAT_URL: string
  KUMA_INSTALL_URL: string
  KUMA_VERSION_URL: string
  KUMA_DOCS_URL: string
  KUMA_API_URL: string
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
    if (pathConfigNode instanceof HTMLScriptElement && pathConfigNode.textContent) {
      try {
        const config = JSON.parse(pathConfigNode.textContent.trim()) as PathConfig

        // Ensures the config always has an absolute URL.
        config.apiUrl = getNormalizedApiUrl(config.apiUrl)

        return config
      } catch {
        // Handled by falling back to a default value.
      }
    }
    // console.error('Unable to parse kuma config. Falling back to defaults')

    return getPathConfigDefault(import.meta.env.PROD ? '/' : import.meta.env.VITE_KUMA_API_SERVER_URL)
  }
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

/**
 * @returns a normalized API URL or URL path without trailing slashes. URL paths will always have a leading slash.
 */
function getNormalizedApiUrl(baseUrlOrPath: string): string {
  if (baseUrlOrPath.startsWith('http')) {
    return baseUrlOrPath.replace(/\/+$/, '')
  } else {
    const basePath = (baseUrlOrPath.startsWith('/') ? '' : '/') + baseUrlOrPath
    return basePath === '/' ? '/' : basePath.replace(/\/+$/, '')
  }
}
