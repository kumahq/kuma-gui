import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      total: 0,
      items: [],
    },
  }
}
