import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type PolicyDataplanesResponse = paths['/meshes/{mesh}/{policyType}/{policyName}/_resources/dataplanes']['get']['responses']['200']['content']['application/json']

export default ({ fake }: Dependencies): ResponseHandler => (_req) => {
  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total: 3,
      items: [
        {
          type: 'Dataplane',
          mesh: 'default',
          name: 'backend',
          labels: fake.kuma.labels({ name: 'backend', mesh: 'default' }),
        },
        {
          type: 'Dataplane',
          mesh: 'default',
          name: 'db',
          labels: fake.kuma.labels({ name: 'db', mesh: 'default' }),
        },
        {
          type: 'Dataplane',
          mesh: 'default',
          name: 'frontend',
          labels: fake.kuma.labels({ name: 'frontend', mesh: 'default' }),
        },
      ],
      next: null,
    } satisfies PolicyDataplanesResponse,
  }
}
