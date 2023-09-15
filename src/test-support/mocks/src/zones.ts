import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, env, pager }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_ZONE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/zones',
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.hacker.noun()}-${id}`
        return {
          type: 'Zone',
          name,
          creationTime: '2020-07-22T19:37:28.442793+03:00',
          modificationTime: '2020-07-22T19:37:28.442793+03:00',
          enabled: true,
        }
      }),
      next,
    },
  }
}
