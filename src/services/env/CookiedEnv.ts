import type { EnvVars } from './Env'
export default (
  env: (str: keyof EnvVars, d?: string) => string,
  cookie: string = document.cookie,
) => (...rest: Parameters<typeof env>) => {
  const cookies = cookie.split(';')
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .reduce((prev, item) => {
      const [key, value] = item.split('=')
      prev[key] = value
      return prev
    }, {} as Record<string, string>)
  const key = rest[0]
  if (key in cookies) {
    return cookies[key]
  }
  return env(...rest)
}
