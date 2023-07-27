import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_SERVICEINSIGHT_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
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
        const online = fake.number.int(100)
        const offline = fake.number.int(100)

        const serviceType = fake.kuma.serviceType()

        const serviceInsight: any = {
          type: 'ServiceInsight',
          serviceType,
          mesh: params.mesh,
          name,
          creationTime: '2021-02-19T08:06:15.14624+01:00',
          modificationTime: '2021-02-19T08:07:37.539229+01:00',
        }

        if (fake.datatype.boolean()) {
          serviceInsight.addressPort = `${name}.mesh:${fake.internet.port()}`
        }

        if (fake.datatype.boolean()) {
          serviceInsight.status = fake.kuma.status()
        }

        if (serviceType === 'internal') {
          serviceInsight.dataplanes = {
            total: online + offline,
            online,
            offline,
          }
        }

        return serviceInsight
      }),
      next,
    },
  }
}
