import type { Dependencies, ResponseHandler } from '#mocks'
export default (_deps: Dependencies): ResponseHandler => (_req) => {
  return {
    headers: {},
    body: {
      total: 0,
      items: [],
    },
  }
}
