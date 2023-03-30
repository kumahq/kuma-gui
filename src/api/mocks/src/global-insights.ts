import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      type: 'GlobalInsights',
      creationTime: '2022-11-15T11:14:19.949886711Z',
      resources: {
        GlobalSecret: {
          total: 5,
        },
        Mesh: {
          total: 1,
        },
        Zone: {
          total: 0,
        },
        ZoneEgress: {
          total: 0,
        },
        ZoneIngress: {
          total: 0,
        },
      },
    },
  }
}
