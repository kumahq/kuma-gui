import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const { name } = req.params
  const zoneName = fake.word.noun()

  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'ZoneEgress',
      name,
      creationTime: '2021-07-13T08:40:59Z',
      modificationTime: '2021-07-13T08:40:59Z',
      zone: zoneName,
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
