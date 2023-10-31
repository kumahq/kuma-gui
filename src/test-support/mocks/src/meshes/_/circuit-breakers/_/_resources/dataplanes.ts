import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
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
