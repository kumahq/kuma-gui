import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { InspectRulesForDataplane } from '@/types/index.d'

export default (_deps: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  // Replicats https://github.com/kumahq/kuma/blob/81edac55b4c631a251cec8327b711129b5091359/pkg/api-server/testdata/inspect/dataplanes/_rules/overriding_meshtimeout.golden.json
  return {
    headers: {},
    body: {
      resource: {
        type: 'Dataplane',
        mesh,
        name,
      },
      rules: [
        {
          fromRules: [
            {
              inbound: {
                port: 8080,
                tags: {
                  'kuma.io/service': 'foo',
                },
              },
              rules: [
                {
                  conf: {
                    connectionTimeout: '20s',
                    idleTimeout: '20s',
                    http: {
                      requestTimeout: '5s',
                    },
                  },
                  matchers: [],
                  origin: [
                    {
                      mesh: 'default',
                      name: 'default',
                      type: 'MeshTimeout',
                    },
                    {
                      mesh: 'default',
                      name: 'override',
                      type: 'MeshTimeout',
                    },
                  ],
                },
              ],
            },
          ],
          toRules: [
            {
              conf: {
                connectionTimeout: '2s',
                idleTimeout: '20s',
                http: {
                  requestTimeout: '15s',
                },
              },
              matchers: [
                {
                  key: 'kuma.io/service',
                  not: false,
                  value: 'foo',
                },
              ],
              origin: [
                {
                  mesh: 'default',
                  name: 'default',
                  type: 'MeshTimeout',
                },
                {
                  mesh: 'default',
                  name: 'override',
                  type: 'MeshTimeout',
                },
              ],
            },
            {
              conf: {
                connectionTimeout: '2s',
                idleTimeout: '20s',
                http: {
                  requestTimeout: '20s',
                },
              },
              matchers: [
                {
                  key: 'kuma.io/service',
                  not: false,
                  value: 'bar',
                },
              ],
              origin: [
                {
                  mesh: 'default',
                  name: 'default',
                  type: 'MeshTimeout',
                },
                {
                  mesh: 'default',
                  name: 'override',
                  type: 'MeshTimeout',
                },
              ],
            },
            {
              conf: {
                connectionTimeout: '2s',
                idleTimeout: '20s',
                http: {
                  requestTimeout: '10s',
                },
              },
              matchers: [
                {
                  key: 'kuma.io/service',
                  not: true,
                  value: 'bar',
                },
                {
                  key: 'kuma.io/service',
                  not: true,
                  value: 'foo',
                },
              ],
              origin: [
                {
                  mesh: 'default',
                  name: 'default',
                  type: 'MeshTimeout',
                },
              ],
            },
          ],
          type: 'MeshTimeout',
          warnings: [],
        },
      ],
    } satisfies InspectRulesForDataplane,
  }
}
