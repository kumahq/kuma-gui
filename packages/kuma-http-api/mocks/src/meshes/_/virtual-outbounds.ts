import type { Dependencies, ResponseHandler } from '#mocks'
export default (_deps: Dependencies): ResponseHandler => (_req) => {
  const total = 0

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }),
      next: null,
    },
  }
}
