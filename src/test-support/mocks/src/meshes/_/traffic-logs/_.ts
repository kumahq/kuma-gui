import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      type: 'TrafficLog',
      mesh: params.mesh,
      name: params.name,
      creationTime: '2020-05-12T12:31:45.606217+02:00',
      modificationTime: '2020-05-12T12:31:45.606217+02:00',
      sources: [
        {
          match: {
            service: fake.hacker.noun(),
            version: '1.0',
          },
        },
      ],
      destinations: [
        {
          match: {
            service: fake.hacker.noun(),
          },
        },
      ],
      conf: {
        backend: 'file',
      },

    },
  }
}
