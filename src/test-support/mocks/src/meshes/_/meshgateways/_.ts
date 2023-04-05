import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
export default (_deps: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      type: 'MeshGateway',
      mesh: params.mesh,
      name: params.name,
      creationTime: '2022-01-25T13:55:51.798701+01:00',
      modificationTime: '2022-01-25T13:55:51.798701+01:00',
      selectors: [
        {
          match: {
            'kuma.io/service': params.name,
          },
        },
      ],
      conf: {
        listeners: [
          {
            hostname: 'foo.example.com',
            port: 8080,
            protocol: 'HTTP',
            tags: {
              port: 'http/8080',
            },
          },
        ],
      },

    },
  }
}
