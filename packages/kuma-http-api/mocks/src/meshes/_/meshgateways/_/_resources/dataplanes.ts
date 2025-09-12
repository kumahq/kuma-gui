import type { Dependencies, ResponseHandler } from '#mocks'

export default (_deps: Dependencies): ResponseHandler => (_req) => {
  return {
    headers: {},
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
