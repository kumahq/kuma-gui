import { defineSources } from '@kumahq/data'

export const sources = () => {
  return defineSources({
    '/me/:route': async () => {
      return {
        params: {},
      }
    },
    '/me/:route/:data': async () => {},
  })
}
