import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, env }: EndpointDependencies): MockResponder => (_req) => {
  const meshTotal = parseInt(env('KUMA_MESH_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
  const policyTotal = fake.number.int({ min: 1, max: 100 })

  const serviceTotal = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 30 })}`))

  const dataplaneTotal = parseInt(env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
  const gatewayBuiltinTotal = fake.number.int({ min: 0, max: 20 })
  const gatewayDelegatedTotal = fake.number.int({ min: 0, max: 20 })

  const zoneControlPlaneTotal = parseInt(env('KUMA_ZONE_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
  const zoneControlPlaneOnline = fake.number.int({ min: 0, max: zoneControlPlaneTotal })

  const zoneEgressTotal = parseInt(env('KUMA_ZONEEGRESS_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
  const zoneEgressOnline = fake.number.int({ min: 0, max: zoneEgressTotal })

  const zoneIngressTotal = parseInt(env('KUMA_ZONEINGRESS_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
  const zoneIngressOnline = fake.number.int({ min: 0, max: zoneIngressTotal })

  return {
    headers: {
    },
    body: {
      dataplanes: {
        gatewayBuiltin: fake.kuma.partitionInto({
          online: Number,
          offline: Number,
          partiallyDegraded: Number,
          total: gatewayBuiltinTotal,
        }, gatewayBuiltinTotal),
        gatewayDelegated: fake.kuma.partitionInto({
          online: Number,
          offline: Number,
          partiallyDegraded: Number,
          total: gatewayDelegatedTotal,
        }, gatewayDelegatedTotal),
        standard: fake.kuma.partitionInto({
          online: Number,
          offline: Number,
          partiallyDegraded: Number,
          total: dataplaneTotal,
        }, dataplaneTotal),
      },
      meshes: {
        total: meshTotal,
      },
      policies: {
        total: policyTotal,
      },
      services: fake.kuma.globalInsightServices({ max: serviceTotal }),
      zones: {
        controlPlanes: {
          total: zoneControlPlaneTotal,
          online: zoneControlPlaneOnline,
        },
        zoneEgresses: {
          total: zoneEgressTotal,
          online: zoneEgressOnline,
        },
        zoneIngresses: {
          total: zoneIngressTotal,
          online: zoneIngressOnline,
        },
      },
    },
  }
}
