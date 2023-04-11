import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
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
