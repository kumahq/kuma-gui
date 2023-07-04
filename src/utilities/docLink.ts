import { useEnv } from './index'

const env = useEnv()

export function docLink(path: string | undefined): string {
  if (!path) {
    path = "/"
  }
  return `${env('KUMA_DOCS_URL')}${path}?${env('KUMA_UTM_QUERY_PARAMS')}`
}
