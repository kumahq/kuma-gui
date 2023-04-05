import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  const total = fake.datatype.number(10)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.hacker.noun()}-${i}`
        return {
          type: 'Zone',
          name,
          creationTime: '2020-07-22T19:37:28.442793+03:00',
          modificationTime: '2020-07-22T19:37:28.442793+03:00',
          enabled: true,
        }
      }),
      next: null,
    },
  }
}
