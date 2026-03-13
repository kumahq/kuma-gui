import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'


export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const [
    mesh = req.params.mesh as string,
    _zone,
    _namespace,
    name = req.params.name as string,
  ] = kri?.split('_') ?? ''
  const k8s = req.url.searchParams.get('format') === 'kubernetes'
  return {
    headers: {},
    body: {
      ...(k8s && { apiVersion: 'kuma.io/v1alpha1' }),
      ...(k8s ? { kind: 'MeshIdentity' } : { type: 'MeshIdentity' }),
      ...((() => {
        const metadata = {
          name,
          labels: {
            'kuma.io/mesh': mesh,
            'kuma.io/zone': fake.word.noun(),
            'kuma.io/origin': 'zone',
            'kuma.io/namespace': fake.word.noun(),
          }}
        return k8s ? { metadata } : metadata
      })()),
      ...(!k8s && {
        creationTime: fake.date.past().toISOString(),
        modificationTime: fake.date.recent().toISOString(),
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
            matchLabels: {
              'kuma.io/mesh': mesh,
              'kuma.io/zone': fake.word.noun(),
            },
          },
        },
        spiffeID: {
          path: fake.kuma.spiffeId({ mesh }),
          trustDomain: fake.word.noun(),
        },
      } satisfies components['schemas']['MeshIdentityItem']['spec'],
    },
  }
}
