import { describe, expect, test } from 'vitest'

import { ConnectionXdsConfig, policyAffectedKeys } from './ConnectionXdsConfig'

type TestCase<T extends (...args: any) => any> = {
  keys: string[]
  input: unknown
  expected: ReturnType<T>
}

describe('ConnectionXdsConfig', () => {
  describe('toFiltered', () => {
    test.each<TestCase<typeof ConnectionXdsConfig.toFiltered>>([
      {
        keys: policyAffectedKeys,
        input: {
          configs: [
            {
              dynamic_active_clusters: [
                {
                  version_info: '959261b5-0f41-4d91-b605-de2515edfebf',
                  cluster: {
                    '@type': 'type.googleapis.com/envoy.config.cluster.v3.Cluster',
                    name: 'default:demo-app-v1_kuma-demo_svc_5050',
                    type: 'EDS',
                    eds_cluster_config: {
                      eds_config: {
                        ads: {},
                        resource_api_version: 'V3',
                      },
                    },
                    connect_timeout: '5s',
                    alt_stat_name: 'default_demo-app-v1_kuma-demo_svc_5050',
                  },
                  last_updated: '2026-02-23T13:25:56.419Z',
                },
              ],
            },
          ],
        },
        expected: {
          configs: [
            {
              dynamic_active_clusters: [
                {
                  cluster: {
                    connect_timeout: '5s',
                  },
                },
              ],
            },
          ],
        },
      },
      {
        keys: ['my_key'],
        input: {
          foo: {
            bar: {
              my_key: 'value',
              other_key: 'other_value',
            },
          },
        },
        expected: {
          foo: {
            bar: {
              my_key: 'value',
            },
          },
        },
      },
      {
        keys: ['my_key', 'another_key'],
        input: {
          configs: [
            {
              foo: {
                bar: {
                  my_key: 'value',
                  other_key: 'other_value',
                },
              },
            },
            {
              bar: {
                my_key: 'value',
                another_key: 'other_value',
              },
            },
            {
              baz: {
                other_key: 'other_value',
                random_key: 'random_value',
              },
            },
          ],
        },
        expected: {
          configs: [
            {
              foo: {
                bar: {
                  my_key: 'value',
                },
              },
            },
            {
              bar: {
                my_key: 'value',
                another_key: 'other_value',
              },
            },
          ],
        },
      },
    ])('.fromObject: $message', ({ input, keys, expected }) => {
      expect(ConnectionXdsConfig.toFiltered(input, keys)).toStrictEqual(expected)
    })
  })
})
