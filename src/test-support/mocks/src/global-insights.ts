import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
export default ({ fake, env }: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      type: 'GlobalInsights',
      creationTime: '2022-11-15T11:14:19.949886711Z',
      resources: {
        GlobalSecret: {
          total: parseInt(env('KUMA_GLOBALSECRET_COUNT', `${fake.datatype.number({ min: 1, max: 100 })}`)),
        },
        Mesh: {
          total: parseInt(env('KUMA_MESH_COUNT', `${fake.datatype.number({ min: 1, max: 100 })}`)),
        },
        Zone: {
          total: parseInt(env('KUMA_ZONE_COUNT', `${fake.datatype.number({ min: 1, max: 100 })}`)),
        },
        ZoneEgress: {
          total: parseInt(env('KUMA_ZONEEGRESS_COUNT', `${fake.datatype.number({ min: 1, max: 100 })}`)),
        },
        ZoneIngress: {
          total: parseInt(env('KUMA_ZONEINGRESS_COUNT', `${fake.datatype.number({ min: 1, max: 100 })}`)),
        },
      },
    },
  }
}
