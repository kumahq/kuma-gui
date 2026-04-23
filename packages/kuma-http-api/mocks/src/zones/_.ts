import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const [
    _mesh,
    _zone,
    _namespace,
    name = req.params.name as string,
  ] = kri?.split('_') ?? ''
  switch (req.method.toUpperCase()) {
    case 'DELETE':
      return {
        headers: {},
        body: {},
      }
    default:
      return {
        headers: {},
        body: {
          type: 'Zone',
          name,
          kri: fake.kuma.kri({ resourceName: 'Zone', mesh: '', zone: '', namespace: '', name  }),
          creationTime: '2021-02-19T08:06:15.380674+01:00',
          modificationTime: '2021-02-19T08:06:15.380674+01:00',
          enabled: true,
        },
      }
  }
}
