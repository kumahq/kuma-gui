import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
export default (_deps: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      name: params.mesh,
      type: 'Mesh',
      creationTime: '2020-06-19T12:18:02.097986-04:00',
      modificationTime: '2020-06-19T12:18:02.097986-04:00',
      mtls: {
        enabledBackend: 'ca-1',
        backends: [
          {
            name: 'ca-1',
            type: 'provided',
            dpCert: {
              rotation: {
                expiration: '1d',
              },
            },
            conf: {
              cert: {
                secret: 'name-of-secret',
              },
              key: {
                secret: 'name-of-secret',
              },
            },
          },
          {
            name: 'ca-2',
            type: 'BUILTIN',
          },
        ],
      },

    },
  }
}
