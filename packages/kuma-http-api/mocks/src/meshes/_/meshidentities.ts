import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'


type MeshIdentitiesResponse = paths['/meshes/{mesh}/meshidentities']['get']['responses']['200']['content']['application/json']

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHIDENTITY_COUNT', `${fake.number.int({ min: 1, max: 3 })}`),
    req,
    `/meshes/${req.params.mesh}/meshidens`,
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }, (_, i) => {
        const id = offset + i
        const [
          _prefix,
          shortName,
          mesh,
          zone,
          nspace,
          displayName,
        ] = [
          'kri', // prefix
          'mtrust', // shortName
          String(req.params.mesh), // mesh
          fake.helpers.arrayElement(['', fake.word.noun()]), // zone
          ...([k8s ? fake.word.noun() : '', `${fake.word.noun()}-${id}`]), // nspace, displayName
        ]
        const name = `${displayName}${nspace ? `.${nspace}` : ''}`

        return {
          ...fake.kuma.timespan(),
          type: 'MeshIdentity',
          mesh,
          name,
          kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, displayName }),
          labels: fake.kuma.labels({
            name: displayName,
            mesh,
            env: k8s ? 'kubernetes' : 'universal',
            ...(zone ? { zone } : {}),
            ...(k8s ? { namespace: nspace } : {}),
          }),
          spec: {
            provider: {
              bundled: {
                autogenerate: {
                  enabled: fake.datatype.boolean(),
                },
                ca: {
                  certificate: {
                    envVar: {
                      name: fake.word.noun() + '-cert',
                    },
                    file: {
                      path: `${fake.system.directoryPath()}/${fake.system.commonFileName('crt')}`,
                    },
                    insecureInline: {
                      value: fake.word.noun(),
                    },
                    secretRef: {
                      kind: 'Secret',
                      name: fake.word.noun(),
                    },
                    type: fake.helpers.arrayElement(['File', 'Secret', 'EnvVar', 'InsecureInline']),
                  },
                  privateKey: {
                    envVar: {
                      name: fake.word.noun(),
                    },
                    file: {
                      path: `${fake.system.directoryPath()}/${fake.system.commonFileName('key')}`,
                    },
                    insecureInline: {
                      value: fake.word.noun(),
                    },
                    secretRef: {
                      kind: 'Secret',
                      name: fake.word.noun(),
                    },
                    type: fake.helpers.arrayElement(['File', 'Secret', 'EnvVar', 'InsecureInline']),
                  },
                },
                certificateParameters: {
                  expiry: fake.date.soon().toISOString(),
                },
                insecureAllowSelfSigned: fake.datatype.boolean(),
                meshTrustCreation: fake.helpers.arrayElement(['Enabled', 'Disabled']),
              },
              spire: {
                agent: {
                  timeout: '1s',
                },
              },
              type: fake.helpers.arrayElement(['Bundled', 'Spire']),
            },
            selector: {
              dataplane: {
                matchLabels: fake.kuma.labels({
                  mesh,
                  ...(zone ? { zone } : {}),
                }),
              },
            },
            spiffeID: {
              path: '/ns/{{ .Namespace }}/sa/{{ .ServiceAccount }}',
              trustDomain: '{{ .Mesh }}.{{ .Zone }}.mesh.local',
            },
          },
          status: {
            conditions: [
              {
                type: 'Ready',
                message: 'Successfully initialized',
                reason: 'Ready',
                status: 'True',
              },
            ],
          },
        }
      }),
    } satisfies MeshIdentitiesResponse,
  }
}
