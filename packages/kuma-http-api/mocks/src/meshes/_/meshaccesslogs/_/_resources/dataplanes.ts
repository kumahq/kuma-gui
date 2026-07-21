import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake }: Dependencies): ResponseHandler => (_req) => {
  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total: 3,
      items: [
        {
          type: 'Dataplane',
          mesh: 'default',
          name: 'backend',
        },
        {
          type: 'Dataplane',
          mesh: 'default',
          name: 'db',
        },
        {
          type: 'Dataplane',
          mesh: 'default',
          name: 'frontend',
        },
      ],
      next: null,
    },
  }
}
