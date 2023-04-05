import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
export default ({ fake, pager }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(fake.datatype.number({ min: 1, max: 200 }), req, `http://localhost:5681/meshes/${req.params.mesh}/traffic-permissions`)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id: number = offset + i
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
      next,
    },
  }
}
