import { describe, expect, test } from '@jest/globals'

import notificationsModule from './notifications'

describe('notifications module', () => {
  describe('getters', () => {
    test('tests singleMeshNotificationItems getter ', () => {
      const rootState: any = {
        selectedMesh: 'web-to-backend.kuma-system',
        meshes: {
          items: [
            {
              name: 'web-to-backend.kuma-system',
              creationTime: '0001-01-01T00:00:00Z',
              modificationTime: '0001-01-01T00:00:00Z',
              type: 'Mesh',
            },
          ],
        },
        currentMeshPolicies: {},
      }
      const getters = {
        meshNotificationItemMap: {
          'web-to-backend.kuma-system': {
            hasLogging: false,
            hasMtls: false,
            hasMetrics: false,
            hasTracing: false,
          },
        },
      }
      const result = notificationsModule.getters.singleMeshNotificationItems(notificationsModule.state(), getters, rootState, {})

      expect(result).toMatchInlineSnapshot(`
[
  {
    "component": "MetricsNotification",
    "isCompleted": false,
    "name": "Observability, Metrics & Service Map",
  },
  {
    "component": "LoggingNotification",
    "isCompleted": false,
    "name": "Logging",
  },
  {
    "component": "MtlsNotification",
    "isCompleted": false,
    "name": "Zero-trust security",
  },
  {
    "component": "TracingNotification",
    "isCompleted": false,
    "name": "Tracing",
  },
]
`)
    })

    test('tests meshNotificationItemMapWithAction getter', () => {
      const rootState: any = {
        meshes: {
          items: [
            {
              name: 'test-1',
              creationTime: '0001-01-01T00:00:00Z',
              modificationTime: '0001-01-01T00:00:00Z',
              type: 'Mesh',
              logging: {},
              mtls: {},
              tracing: {},
              metrics: {},
            },
            {
              name: 'test-2',
              creationTime: '0001-01-01T00:00:00Z',
              modificationTime: '0001-01-01T00:00:00Z',
              type: 'Mesh',
              mtls: {},
            },
          ],
        },
      }

      const getters = {
        meshNotificationItemMap: {
          'test-2': {
            hasLogging: false,
            hasMtls: true,
            hasMetrics: false,
            hasTracing: false,
          },
        },
      }

      const result = notificationsModule.getters.meshNotificationItemMapWithAction(notificationsModule.state(), getters, rootState, undefined)

      expect(result).toMatchInlineSnapshot(`
{
  "test-2": {
    "hasLogging": false,
    "hasMetrics": false,
    "hasMtls": true,
    "hasTracing": false,
  },
}
`)
    })

    test('tests amountOfActions getter', () => {
      const rootState: any = {
        meshes: {
          items: [
            {
              name: 'test-1',
              creationTime: '0001-01-01T00:00:00Z',
              modificationTime: '0001-01-01T00:00:00Z',
              type: 'Mesh',
              logging: {},
            },
            {
              name: 'test-2',
              creationTime: '0001-01-01T00:00:00Z',
              modificationTime: '0001-01-01T00:00:00Z',
              type: 'Mesh',
              mtls: {},
            },
          ],
        },
      }

      const getters = {
        meshNotificationItemMapWithAction: {
          'test-1': {
            hasLogging: false,
            hasMetrics: false,
            hasMtls: false,
            hasTracing: false,
          },
          'test-2': {
            hasLogging: false,
            hasMetrics: false,
            hasMtls: true,
            hasTracing: false,
          },
        },
      }

      const result = notificationsModule.getters.amountOfActions(notificationsModule.state(), getters, rootState, undefined)

      expect(result).toBe(2)
    })
  })
})
