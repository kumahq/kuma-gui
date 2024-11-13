import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { mesh } = req.params
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_FAULTINJECTION_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${mesh}/fault-injections`,
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.hacker.noun()}-${id}`

        return {
          type: 'FaultInjection',
          mesh,
          name,
          sources: [
            {
              match: {
                service: `${fake.hacker.noun()}`,
              },
            },
          ],
          destinations: [
            {
              match: {
                service: `${fake.hacker.noun()}`,
              },
            },
          ],
          conf: {
            delay: {
              percentage: 50,
              value: '0.010s',
            },
            abort: {
              percentage: 40,
              httpStatus: 500,
            },
            responseBandwidth: {
              percentage: 40,
              limit: '50kbps',
            },
          },
        }
      }),
      next,
    },
  }
}
