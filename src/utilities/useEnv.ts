import { PATH_CONFIG_DEFAULT } from '@/pathConfigDefault'
import { PathConfig } from '@/types/index'

type EnvVars = {
  KUMA_NAME: string
  KUMA_VERSION: string
  KUMA_BASE_PATH: string
  KUMA_API_URL: string
  KUMA_DOCS_URL: string
  KUMA_UTM_QUERY_PARAMS: string
  KUMA_FEEDBACK_URL: string
}

const config = readPathConfigFromDom()
const version = semver(config.version) // basedOnKuma

const env: EnvVars = {
  KUMA_NAME: `${import.meta.env.VITE_NAMESPACE}`,
  KUMA_VERSION: version.pre,
  KUMA_API_URL: config.apiUrl,
  KUMA_BASE_PATH: config.baseGuiPath,
  KUMA_DOCS_URL: `${import.meta.env.VITE_DOCS_BASE_URL}/${version.patch === '0.0.0' ? 'dev' : version.patch.replace(/\.\d+$/, '.x')}/`,
  // remove the ? for now incase we need to append to an already query
  // param'ed URL
  KUMA_UTM_QUERY_PARAMS: import.meta.env.VITE_UTM.substring(1),
  KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
}

export const useEnv = () => {
  return (key: keyof EnvVars) => {
    return env[key]
  }
}

export function semver(version: string): { major: string, minor: string, patch: string, pre: string } {
  const [major, minor, ...patchPre] = version.split('.')
  const [patch, pre] = patchPre.join('.').split('-')
  return {
    major,
    minor: `${major}.${minor}`,
    patch: `${major}.${minor}.${patch}`,
    pre: `${major}.${minor}.${patch}-${pre}`,
  }
}

/**
 * Reads the path config object from a JSON string found in a special script
 * tag that’s populated during server-side rendering of the Vue application’s
 * index.html file.
 */
function readPathConfigFromDom(): PathConfig {
  const pathConfigNode = document.querySelector('#kuma-config')

  if (pathConfigNode instanceof HTMLScriptElement) {
    try {
      return JSON.parse(pathConfigNode.innerText.trim())
    } catch {
      // Handled by falling back to a default value.
    }
  }

  // Falls back to a sensible default when encountering a malformed JSON payload
  // or non-replaced template.
  return PATH_CONFIG_DEFAULT
}
