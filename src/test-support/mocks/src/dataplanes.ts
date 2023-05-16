import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  const total = fake.number.int(20)
  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        return {
          type: 'Dataplane',
          mesh: `${fake.hacker.noun()}-${i}`,
          name: `${fake.hacker.noun()}-${i}`,
          networking: {},
        }
      }),
      next: null,
    },
  }
}
