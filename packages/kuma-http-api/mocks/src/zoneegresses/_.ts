import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const [
    _mesh,
    zone = req.params.zone as string | undefined,
    namespace = '',
    name = req.params.name as string,
  ] = kri?.split('_') ?? ''

  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'ZoneEgress',
      name,
      kri: fake.kuma.kri({ resourceName: 'ZoneEgress', mesh: '', zone, namespace: namespace || fake.helpers.arrayElement([fake.k8s.namespace(), 'kuma-system']), name }),
      creationTime: '2021-07-13T08:40:59Z',
      modificationTime: '2021-07-13T08:40:59Z',
      zone: zone ?? fake.word.noun(),
      networking: {
        address: fake.internet.ip(),
        port: fake.internet.port(),
        admin: {
          port: fake.internet.port(),
        },
      },
    },
  }
}
