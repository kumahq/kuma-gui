import type { EndpointDependencies } from '@/test-support/fake'
export default (_deps: EndpointDependencies) => () => {
  return {
    headers: {},
    body: '5.1.0',
  }
}
