import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  fake.kuma.seed('')
  return {
    headers: {},
    body: fake.helpers.arrayElement(['2.1.0', '5.1.0']),
  }
}
