import { describe, expect, test } from '@jest/globals'

import { mergeInsightsReducer } from './mesh-insights'
import type { MeshInsight } from '@/types/index.d'

function getMeshInsight(): MeshInsight {
  return {
    type: 'MeshInsight',
    name: '',
    creationTime: '',
    modificationTime: '',
    lastSync: '',
    dataplanes: {
      total: 13,
      online: 10,
      partiallyDegraded: 3,
    },
    dataplanesByType: {
      standard: {
        total: 10,
        online: 8,
        partiallyDegraded: 2,
      },
      gateway: {
        total: 3,
        online: 2,
        partiallyDegraded: 1,
      },
    },
    policies: {
      Secret: {
        total: 6,
      },
      ServiceInsight: {
        total: 11,
      },
      TrafficPermission: {
        total: 3,
      },
      TrafficRoute: {
        total: 5,
      },
    },
    dpVersions: {
      kumaDp: {
        '1.0.4': {
          total: 3,
          online: 2,
        },
        '1.0.5': {
          total: 1,
          online: 1,
        },
      },
      envoy: {
        '1.16.2': {
          total: 4,
          online: 1,
        },
        '1.16.1': {
          total: 8,
          online: 1,
        },
      },
    },
    mTLS: {},
    services: {},
  }
}

describe('mesh-insights', () => {
  test('calls mergeInsightsReducer with mesh insights', () => {
    expect(mergeInsightsReducer([getMeshInsight()])).toMatchSnapshot()
  })

  test('calls mergeInsightsReducer with an empty array', () => {
    expect(mergeInsightsReducer([])).toMatchSnapshot()
  })

  test('calls mergeInsightsReducer with mesh insights array', () => {
    expect(
      mergeInsightsReducer([
        getMeshInsight(),
        {
          ...getMeshInsight(),
          ...{
            policies: {
              Secret: {
                total: 6,
              },
              ServiceInsight: {
                total: 11,
              },
              TrafficPermission: {
                total: 3,
              },
              TrafficRoute: {
                total: 5,
              },
            },
          },
        },
        {
          ...getMeshInsight(),
          ...{
            dataPlaneProxies: {
              total: 10,
              online: 8,
              partiallyDegraded: 2,
            },
          },
        },
        {
          ...getMeshInsight(),
          ...{
            dpVersions: {
              kumaDp: {
                '1.0.4': {
                  total: 3,
                  online: 2,
                },
                '1.0.5': {
                  total: 1,
                  online: 1,
                },
              },
              envoy: {},
            },
          },
        },
        {
          ...getMeshInsight(),
          ...{
            policies: {},
            dataPlaneProxies: {},
            gateways: {},
            dpVersions: {
              kumaDp: {},
              envoy: {},
            },
          },
        },
      ]),
    ).toMatchSnapshot()
  })
})
