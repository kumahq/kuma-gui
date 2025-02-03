import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshGatewayRoute',
      mesh: params.mesh,
      name: params.name,
      creationTime: '2022-01-25T13:58:29.381342+01:00',
      modificationTime: '2022-01-25T13:58:29.381342+01:00',
      selectors: [
        {
          match: {
            'kuma.io/service': params.name,
          },
        },
      ],
      conf: {
        http: {
          rules: [
            {
              matches: [
                {
                  path: {
                    match: 'PREFIX',
                    value: '/',
                  },
                },
              ],
              backends: [
                {
                  destination: {
                    'kuma.io/service': fake.word.noun(),
                  },
                },
              ],
            },
          ],
        },
      },
    },
  }
}
