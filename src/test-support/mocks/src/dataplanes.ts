import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake, pager }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/dataplanes',
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i

        return {
          type: 'Dataplane',
          mesh: `${fake.hacker.noun()}-${id}`,
          name: `${fake.hacker.noun()}-${id}`,
          networking: {},
        }
      }),
    },
  }
}
