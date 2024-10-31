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

export type EnvArgs = {
  KUMA_VERSION_URL: string
  KUMA_DOCS_URL: string
  KUMA_MOCK_API_ENABLED: string
}
type EnvProps = {
  KUMA_VERSION: string
  KUMA_BASE_PATH: string
  KUMA_API_URL: string
  KUMA_KDS_URL: string
  KUMA_MODE: string
  KUMA_ENVIRONMENT: string
  KUMA_STORE_TYPE: string
}
export type EnvVars = EnvArgs & EnvProps

type EnvInternal = EnvArgs & Partial<EnvProps>
export default class Env {
  protected env: EnvVars | undefined
  constructor(envArgs: EnvArgs) {
    const _env: EnvInternal = envArgs
    const env = (str: keyof EnvInternal, d: string = '') => this.var(str, _env?.[str] ?? d)

    const config = this.getConfig()
    const mode = env('KUMA_MODE') || config.mode
    const version = semver(env('KUMA_VERSION', config.version))

    this.env = {
      ..._env as EnvVars,
      // TODO(jc): not totally sure we need to use a regex here, maybe just split and join if not
      KUMA_DOCS_URL: `${env('KUMA_DOCS_URL')}/${version.patch === '0.0.0' ? 'dev' : version.patch.replace(/\.\d+$/, '.x')}`,
      KUMA_VERSION: version.pre,
      KUMA_API_URL: env('KUMA_API_URL') || config.apiUrl,
      KUMA_BASE_PATH: env('KUMA_BASE_PATH') || config.baseGuiPath,
      KUMA_MODE: mode,
      KUMA_ENVIRONMENT: env('KUMA_ENVIRONMENT') || config.environment,
      KUMA_STORE_TYPE: env('KUMA_STORE_TYPE') || config.storeType,
      KUMA_KDS_URL: 'grpcs://<global-kds-address>:5685',
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
  protected getConfig(): KumaHtmlVars {
    const pathConfigNode = document.querySelector('#kuma-config')
    if (pathConfigNode instanceof HTMLScriptElement && pathConfigNode.textContent) {
      const config = JSON.parse(pathConfigNode.textContent.trim())
      // Ensures the API baseUrl always has an absolute, non-trailing slash URL,
      // i.e. a base.
      // Chosen to be done here as this is the closest point to the backend we
      // can get
      config.apiUrl = normalizeBaseUrl(config.apiUrl)
      return config
    }
    const msg = 'Unable to parse kuma config. Please check your instance of kuma is running correctly'
    console.error(msg)
    throw new Error(msg)
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
