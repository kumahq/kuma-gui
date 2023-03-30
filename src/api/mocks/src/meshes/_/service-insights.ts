import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_SERVICEINSIGHT_COUNT', `${fake.datatype.number({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${params.mesh}/service-insights`,
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.hacker.noun()}-${id}`
        const online = fake.datatype.number(100)
        const offline = fake.datatype.number(100)

        return {
          type: 'ServiceInsight',
          serviceType: fake.kuma.serviceType(),
          mesh: params.mesh,
          name,
          creationTime: '2021-02-19T08:06:15.14624+01:00',
          modificationTime: '2021-02-19T08:07:37.539229+01:00',
          addressPort: `${name}.mesh:${fake.internet.port()}`,
          status: fake.kuma.status(),
          dataplanes: {
            total: online + offline,
            online,
            offline,
          },
        }
      }),
      next,
    },
  }
}
