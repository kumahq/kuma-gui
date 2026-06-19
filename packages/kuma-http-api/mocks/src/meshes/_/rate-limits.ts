import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake }: Dependencies): ResponseHandler => (_req) => {
  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total: 0,
      items: [],
    },
  }
}
