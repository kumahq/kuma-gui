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
        },
      ]
      store.state.selectedMesh = 'web-to-backend.kuma-system'

      expect(store.getters['notifications/singleMeshNotificationItems']).toMatchInlineSnapshot(`
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

    it('tests meshNotificationItemMapWithAction getter', () => {
      store.state.meshes.items = [
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
      ]

      expect(store.getters['notifications/meshNotificationItemMapWithAction']).toMatchInlineSnapshot(`
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

    it('tests amountOfActions getter', () => {
      store.state.meshes.items = [
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
      ]

      expect(store.getters['notifications/amountOfActions']).toBe(2)
    })
  })
})
