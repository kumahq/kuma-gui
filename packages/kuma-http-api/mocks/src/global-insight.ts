import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type GlobalInsight = paths['/global-insight']['get']['responses']['200']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (_req) => {
  const resourceCount = parseInt(env('KUMA_ACTIVE_RESOURCE_COUNT', `${Number.MAX_SAFE_INTEGER}`))
  const meshTotal = parseInt(env('KUMA_MESH_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))

  const policyTotal = fake.number.int({ min: 1, max: 100 })
  const serviceTotal = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 30 })}`))
  const dataplaneTotal = parseInt(env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
  const zoneControlPlaneTotal = parseInt(env('KUMA_ZONE_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))

  const internalTotal = fake.number.int({ min: 0, max: serviceTotal })
  const externalTotal = fake.number.int({ min: 0, max: serviceTotal - internalTotal })

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      createdAt: fake.kuma.nanodate(),
      dataplanes: fake.kuma.partitionInto({
        online: Number,
        offline: Number,
        partiallyDegraded: Number,
        total: dataplaneTotal,
      }, dataplaneTotal),
      meshes: {
        total: meshTotal,
      },
      policies: {
        total: policyTotal,
      },
      services: {
        external: {
          total: externalTotal,
        },
        internal: fake.kuma.partitionInto({
          total: internalTotal,
          online: Number,
          offline: Number,
          partiallyDegraded: Number,
        }, internalTotal),
      },
      zones: {
        controlPlanes: fake.kuma.partitionInto({
          online: Number,
          offline: Number,
          total: zoneControlPlaneTotal,
        }, zoneControlPlaneTotal),
      },
      resources: {
        ...Object.fromEntries(fake.kuma.resourceNames(resourceCount).map((name) => [name, { total: fake.number.int({ min: 0, max: 20 })}])),
      },
    } satisfies GlobalInsight,
  }
}
