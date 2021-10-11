import setupStore from '@/testUtils/setupStore'
import notifications from '.'

describe('notifications module', () => {
  describe('getters', () => {
    it('tests singleMeshNotificationItems getter ', () => {
      const store = setupStore({
        ...notifications,
        getters: {
          ...notifications.getters,
          getMeshList: () => ({ items: [{}] }),
        },
      })

      expect(store.getters.singleMeshNotificationItems).toMatchInlineSnapshot(`
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
      const store = setupStore({
        ...notifications,
        getters: {
          ...notifications.getters,
          getMeshList: () => ({
            items: [
              {
                logging: {},
                mtls: {},
                tracing: {},
                metrics: {},
                name: 'default',
              },
              {
                mtls: {},
                name: 'test',
              },
            ],
          }),
        },
      })

      expect(store.getters.meshNotificationItemMapWithAction).toMatchInlineSnapshot(`
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
      const store = setupStore({
        ...notifications,
        getters: {
          ...notifications.getters,
          getMeshList: () => ({
            items: [
              {
                logging: {},
                name: 'default',
              },
              {
                mtls: {},
                name: 'test',
              },
            ],
          }),
        },
      })

      expect(store.getters.amountOfActions).toBe(2)
    })
  })
})
