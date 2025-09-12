import type { Dependencies, ResponseHandler } from '#mocks'
import type { ExternalService } from '@/types/index.d'

export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
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
        const mesh = req.params.mesh as string
        const nameQueryParam = req.url.searchParams.get('name')
        const name = nameQueryParam ?? `${fake.word.noun()}-external-${id}`

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
        } satisfies ExternalService
      }),
    },
  }
}
