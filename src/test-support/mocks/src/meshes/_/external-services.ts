import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_EXTERNALSERVICE_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/external-services`,
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const mesh = req.params.mesh
        const nameQueryParam = req.url.searchParams.get('name')
        const name = nameQueryParam ?? `${fake.hacker.noun()}-external-${id}`

        return {
          type: 'ExternalService',
          mesh,
          name,
          creationTime: '2021-02-02T10:59:26.640498+01:00',
          modificationTime: '2021-02-02T10:59:26.640498+01:00',
          networking: {
            address: `${name}.mesh:${fake.internet.port()}`,
            tls: {
              enabled: true,
              allowRenegotiation: false,
              clientCert: {
                secret: 'clientCert',
              },
              clientKey: {
                secret: 'clientKey',
              },
            },
          },
          tags: {
            'kuma.io/protocol': fake.kuma.protocol(),
            'kuma.io/service': name,
          },
        }
      }),
    },
  }
}
