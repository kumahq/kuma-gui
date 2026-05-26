import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'


export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_mid_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'mid', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  const k8sFormat = req.url.searchParams.get('format') === 'kubernetes'
  return {
    headers: {},
    body: {
      ...(k8sFormat && { apiVersion: 'kuma.io/v1alpha1' }),
      ...(k8sFormat ? { kind: 'MeshIdentity' } : { type: 'MeshIdentity' }),
      ...((() => {
        const metadata = {
          name,
          labels: {
            ...fake.kuma.labels({
              name: displayName,
              ...(zone ? { zone } : {}),
              ...(k8s ? { namespace: nspace } : {}),
            }),
          }}
        return k8sFormat ? { metadata } : metadata
      })()),
      ...(!k8sFormat && {
        creationTime: fake.date.past().toISOString(),
        modificationTime: fake.date.recent().toISOString(),
      }),
      kri: fake.kuma.kri({ resourceName: 'MeshIdentity', mesh, name }),
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
