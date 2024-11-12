import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    fake.number.int({ min: 1, max: 200 }),
    req,
    `/meshes/${req.params.mesh}/traffic-permissions`,
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.hacker.noun()}-${id}`

        return {
          type: 'TrafficPermission',
          mesh: req.params.mesh,
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
        }
      }),
    },
  }
}
