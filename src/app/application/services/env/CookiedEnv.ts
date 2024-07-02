import type { EnvVars } from './Env'

const strToEnv = (str: string): [string, string][] => {
  return str.split(';')
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .map((item) => {
      const [key, ...value] = item.split('=')
      return [key, value.join('=')] as [string, string]
    })
    .filter(([key, _value]) => key.startsWith('KUMA_'))
}

export default (
  env: (str: keyof EnvVars, d?: string) => string,
  doc: {
    cookie: string
    location: {
      hash: string
    }
  } = document,
) => (...rest: Parameters<typeof env>) => {
  if (doc.location.hash.length > 0) {
    const hashEnv = strToEnv(document.location.hash.substring(1))
    doc.location.hash = ''
    if (hashEnv.length > 0) {
      doc.cookie = hashEnv.map(([key, value]) => `${key}=${value}`).join(';')
    }
  }
  const cookies = strToEnv(doc.cookie).reduce((prev, [key, value]) => {
    prev[key] = value
    return prev
  }, {} as Record<string, string>)
  const key = rest[0]
  if (key in cookies) {
    return cookies[key]
  }
  return env(...rest)
}
