import { describe, expect, test } from '@jest/globals'

import { mergeInsightsReducer, parseInsightReducer } from './mesh-insights'

describe('mesh-insights', () => {
  const meshInsightObject = {
    dataplanes: {
      total: 13,
      online: 3,
      partiallyDegraded: 5,
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
  }

  test('calls parseInsightReducer without any data', () => {
    expect(parseInsightReducer()).toMatchSnapshot()
  })

  test('calls parseInsightReducer with mesh insights', () => {
    expect(parseInsightReducer(meshInsightObject)).toMatchSnapshot()
  })

  test('calls mergeInsightsReducer with an empty array', () => {
    expect(mergeInsightsReducer([])).toMatchSnapshot()
  })

  test('calls mergeInsightsReducer with mesh insights array', () => {
    expect(
      mergeInsightsReducer([
        meshInsightObject,
        {
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

        {
          dataplanes: {
            total: 13,
            online: 3,
            partiallyDegraded: 5,
          },
        },
        {
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
          },
        },
        { policies: {}, dataplanes: {}, dpVersions: {} },
      ]),
    ).toMatchSnapshot()
  })
})
