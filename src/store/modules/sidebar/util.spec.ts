import { describe, expect, test } from '@jest/globals'

import { calculateMeshInsights, calculateGlobalInsights } from './utils'

describe('sidebar utils', () => {
  describe('calculateMeshInsights', () => {
    test('when no item', async () => {
      const meshInsight = calculateMeshInsights({ items: [] })

      expect(meshInsight).toMatchInlineSnapshot(`
{
  "dataplanes": {
    "gateway": 0,
    "standard": 0,
    "total": 0,
  },
  "policies": {
    "total": 0,
  },
  "services": {
    "external": 0,
    "internal": 0,
    "total": 0,
  },
}
`)
    })
    test('when several items', async () => {
      const meshInsight = calculateMeshInsights({
        items: [
          {
            type: 'MeshInsight',
            name: 'test-mesh',
            creationTime: '2021-01-29T07:10:02.339031+01:00',
            modificationTime: '2021-01-29T07:29:02.314448+01:00',
            lastSync: '2021-01-29T06:29:02.314447Z',
            dataplanes: {
              total: 13,
              online: 3,
              partiallyDegraded: 5,
            },
            dataplanesByType: {
              standard: {},
              gateway: {
                total: 5,
                online: 1,
                partiallyDegraded: 1,
              },
            },
            policies: {
              Secret: {
                total: 6,
              },
              TrafficPermission: {
                total: 3,
              },
              TrafficRoute: {
                total: 5,
              },
            },
            dpVersions: {
              kumaDp: {},
              envoy: {},
            },
            mTLS: {
              issuedBackends: {},
            },
            services: {
              total: 5,
              internal: 3,
              external: 2,
            },
          },
          {
            type: 'MeshInsight',
            name: 'hello-world',
            creationTime: '0001-01-01T00:00:00Z',
            modificationTime: '0001-01-01T00:00:00Z',
            lastSync: '2020-11-17T12:24:11.941534Z',
            dataplanes: {
              total: 1,
              partiallyDegraded: 1,
            },
            dataplanesByType: {
              standard: {
                total: 1,
                online: 0,
                partiallyDegraded: 1,
              },
              gateway: {},
            },
            policies: {
              Secret: {
                total: 1,
              },
              TrafficPermission: {
                total: 1,
              },
              TrafficRoute: {
                total: 1,
              },
            },
            dpVersions: {
              kumaDp: {},
              envoy: {},
            },
            mTLS: {},
            services: {
              total: 2,
              internal: 0,
              external: 2,
            },
          },
          {
            type: 'MeshInsight',
            name: 'kong-mania-12',
            creationTime: '0001-01-01T00:00:00Z',
            modificationTime: '0001-01-01T00:00:00Z',
            lastSync: '2020-11-17T12:24:11.941534Z',
            dataplanes: {
              total: 4,
              partiallyDegraded: 1,
            },
            dataplanesByType: {
              standard: {
                total: 4,
                online: 0,
                partiallyDegraded: 1,
              },
              gateway: {
                total: 0,
                online: 0,
                partiallyDegraded: 0,
              },
            },
            policies: {
              Secret: {
                total: 1,
              },
              TrafficPermission: {
                total: 1,
              },
              TrafficRoute: {
                total: 1,
              },
            },
            dpVersions: {
              kumaDp: {},
              envoy: {},
            },
            mTLS: {},
            services: {
              total: 2,
              internal: 0,
              external: 2,
            },
          },
        ],
      })

      expect(meshInsight).toMatchInlineSnapshot(`
{
  "dataplanes": {
    "gateway": 5,
    "standard": 5,
    "total": 18,
  },
  "policies": {
    "Secret": 8,
    "TrafficPermission": 5,
    "TrafficRoute": 7,
    "total": 20,
  },
  "services": {
    "external": 6,
    "internal": 3,
    "total": 9,
  },
}
`)
    })
  })

  describe('calculateGlobalInsights', () => {
    test('when no item', async () => {
      const meshInsight = calculateGlobalInsights({
        type: 'GlobalInsights',
        creationTime: '123',
        resources: {},
      })

      expect(meshInsight).toMatchInlineSnapshot('{}')
    })

    test('when several items', async () => {
      const meshInsight = calculateGlobalInsights({
        type: 'GlobalInsights',
        creationTime: '2018-07-17T16:05:36.995Z',
        resources: {
          GlobalSecret: { total: 0 },
          Mesh: { total: 4 },
          Zone: { total: 4 },
          ZoneIngress: { total: 1 },
          ZoneEgress: { total: 1 },
        },
      })

      expect(meshInsight).toMatchInlineSnapshot(`
{
  "GlobalSecret": 0,
  "Mesh": 4,
  "Zone": 4,
  "ZoneEgress": 1,
  "ZoneIngress": 1,
}
`)
    })
  })
})
