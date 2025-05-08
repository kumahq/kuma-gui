import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    fake.number.int({ min: 1, max: 200 }),
    req,
    `/meshes/${req.params.mesh}/traffic-permissions`,
  )

  const nameQuery = req.url.searchParams.get('name')

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${nameQuery?.padEnd(nameQuery.length + 1, '-') ?? ''}${fake.word.noun()}-${id}`

        return {
          type: 'TrafficPermission',
          mesh: req.params.mesh,
          name,
          sources: [
            {
              match: {
                service: `${fake.word.noun()}`,
              },
            },
          ],
          destinations: [
            {
              match: {
                service: `${fake.word.noun()}`,
              },
            },
          ],
        }
      }),
    },
  }
}
