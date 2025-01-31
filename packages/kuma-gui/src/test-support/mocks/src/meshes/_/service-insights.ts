import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { ServiceInsight } from '@/types/index.d'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/service-insights`,
  )

  const serviceType = req.url.searchParams.get('type')
  const serviceTypes = serviceType ? serviceType.split(',') as Array<'internal' | 'external' | 'gateway_delegated' | 'gateway_builtin'> : undefined

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const serviceType = serviceTypes || fake.datatype.boolean() ? fake.kuma.serviceType({ serviceTypes }) : undefined
        const mesh = req.params.mesh as string
        const name = `${fake.word.noun()}-${id}-${serviceType}`
        const addressPort = serviceType !== 'external' ? `${name}.mesh:${fake.internet.port()}` : undefined
        const status = serviceType !== 'external' ? fake.kuma.serviceStatusKeyword() : undefined
        const dataplanes = serviceType !== 'external' ? fake.kuma.healthStatus() : undefined

        return {
          type: 'ServiceInsight',
          mesh,
          name,
          creationTime: '2021-02-19T08:06:15.14624+01:00',
          modificationTime: '2021-02-19T08:07:37.539229+01:00',
          ...(serviceType && { serviceType }),
          ...(addressPort && { addressPort }),
          ...(status && { status }),
          ...(dataplanes && { dataplanes }),
        } satisfies ServiceInsight
      }),
    },
  }
}
