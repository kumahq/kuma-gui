import { createStore } from 'vuex'

import { storeConfig, State } from '../../index'

const store = createStore<State>(storeConfig)

describe('notifications module', () => {
  describe('getters', () => {
    it('tests singleMeshNotificationItems getter ', () => {
      store.state.meshes.items = [
        {
          name: 'web-to-backend.kuma-system',
          creationTime: '0001-01-01T00:00:00Z',
          modificationTime: '0001-01-01T00:00:00Z',
          type: 'Mesh',
        }
      ]
      store.state.selectedMesh = 'web-to-backend.kuma-system'

      expect(store.getters['notifications/singleMeshNotificationItems']).toMatchInlineSnapshot(`
        Array [
          Object {
            "component": "MetricsNotification",
            "isCompleted": false,
            "name": "Observability, Metrics & Service Map",
          },
          Object {
            "component": "LoggingNotification",
            "isCompleted": false,
            "name": "Logging",
          },
          Object {
            "component": "MtlsNotification",
            "isCompleted": false,
            "name": "Zero-trust security",
          },
          Object {
            "component": "TracingNotification",
            "isCompleted": false,
            "name": "Tracing",
          },
        ]
      `)
    })

    it('tests meshNotificationItemMapWithAction getter', () => {
      store.state.meshes.items = [
        {
          name: 'default',
          creationTime: '0001-01-01T00:00:00Z',
          modificationTime: '0001-01-01T00:00:00Z',
          type: 'Mesh',
          logging: {},
          mtls: {},
          tracing: {},
          metrics: {},
        },
        {
          name: 'test',
          creationTime: '0001-01-01T00:00:00Z',
          modificationTime: '0001-01-01T00:00:00Z',
          type: 'Mesh',
          mtls: {},
        },
      ]

      expect(store.getters['notifications/meshNotificationItemMapWithAction']).toMatchInlineSnapshot(`
        Object {
          "test": Object {
            "hasLogging": false,
            "hasMetrics": false,
            "hasMtls": true,
            "hasTracing": false,
          },
        }
      `)
    })

    it('tests amountOfActions getter', () => {
      store.state.meshes.items = [
        {
          name: 'default',
          creationTime: '0001-01-01T00:00:00Z',
          modificationTime: '0001-01-01T00:00:00Z',
          type: 'Mesh',
          logging: {},
        },
        {
          name: 'test',
          creationTime: '0001-01-01T00:00:00Z',
          modificationTime: '0001-01-01T00:00:00Z',
          type: 'Mesh',
          mtls: {},
        },
      ]

      expect(store.getters['notifications/amountOfActions']).toBe(2)
    })
  })
})
