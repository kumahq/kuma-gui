import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_SERVICEINSIGHT_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/service-insights`,
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const serviceType = fake.kuma.serviceType()
        const mesh = req.params.mesh
        const name = `${fake.hacker.noun()}-${id}_${serviceType}`

        const serviceInsight: any = {
          type: 'ServiceInsight',
          serviceType,
          mesh,
          name,
          creationTime: '2021-02-19T08:06:15.14624+01:00',
          modificationTime: '2021-02-19T08:07:37.539229+01:00',
        }

        if (serviceType === 'internal') {
          serviceInsight.addressPort = `${name}.mesh:${fake.internet.port()}`
          serviceInsight.status = fake.kuma.status()
          serviceInsight.dataplanes = fake.kuma.dataPlaneProxyStatus()
        }

        return serviceInsight
      }),
    },
  }
}
