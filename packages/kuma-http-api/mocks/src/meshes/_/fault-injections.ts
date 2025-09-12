import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const { mesh } = req.params
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_FAULTINJECTION_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${mesh}/fault-injections`,
  )

  const queryName = req.url.searchParams.get('name')

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${queryName?.padEnd(queryName.length + 1, '-') ?? ''}${fake.word.noun()}-${id}`

        return {
          type: 'FaultInjection',
          mesh,
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
