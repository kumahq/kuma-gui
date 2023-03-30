import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  const total = 0

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, _i) => {
      // eslint-disable-next-line no-useless-return, array-callback-return
        return
      }),
      next: null,
    },
  }
}
