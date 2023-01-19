import Env from './Env'
export default class CookiedEnv extends Env {
  var(...rest: Parameters<Env['var']>) {
    const cookies = document.cookie.split(';')
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
    return super.var(...rest)
  }
}
