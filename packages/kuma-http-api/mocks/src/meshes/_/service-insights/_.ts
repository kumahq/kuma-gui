import type { Dependencies, ResponseHandler } from '#mocks'
import type { ServiceInsight } from '@/types/index.d'

export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  const paramType = ['internal', 'gateway_builtin', 'gateway_delegated', 'external'].find((type) => name.endsWith(`-${type}`)) as 'internal' | 'external' | 'gateway_delegated' | 'gateway_builtin' | undefined
  const serviceType = paramType ?? (fake.datatype.boolean() ? fake.kuma.serviceType() : undefined)
  const addressPort = serviceType !== 'external' ? `${name}.mesh:${fake.internet.port()}` : undefined
  const status = serviceType !== 'external' ? fake.kuma.serviceStatusKeyword() : undefined

  return {
    headers: {},
    body: {
      type: 'ServiceInsight',
      mesh,
      name,
      creationTime: '2021-02-19T08:06:15.14624+01:00',
      modificationTime: '2021-02-19T08:07:37.539229+01:00',
      ...(serviceType && { serviceType }),
      ...(addressPort && { addressPort }),
      ...(status && { status }),
      ...(serviceType !== 'external' && { dataplanes: (() => {
        const total = fake.number.int({ min: 1, max: 10 })
        return fake.kuma.partitionInto({
          total,
          online: Number,
          partiallyDegraded: Number,
          offline: Number,
        }, total)
      })()}),
    } satisfies ServiceInsight,
  }
}
