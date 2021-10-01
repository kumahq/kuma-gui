import setupStore from '@/testUtils/setupStore'
import notifications from '.'

describe('notifications module', () => {
  describe('getters', () => {
    it('tests items getter when no mesh fulfil terms and no onboarding', () => {
      const store = setupStore({
        ...notifications,
        getters: {
          ...notifications.getters,
          getMeshList: () => ({ items: [{}] }),
          showOnboarding: () => false,
        },
      })

      expect(store.getters.items).toMatchInlineSnapshot(`
        Array [
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
            "component": "MetricsNotification",
            "isCompleted": false,
            "name": "Observability & Metrics",
          },
          Object {
            "component": "TracingNotification",
            "isCompleted": false,
            "name": " Tracking",
          },
        ]
      `)
    })

    it('tests items getter when meshes fulfil terms and onboarding active', () => {
      const store = setupStore({
        ...notifications,
        getters: {
          ...notifications.getters,
          getMeshList: () => ({
            items: [
              {
                logging: {},
                tracking: {},
                mtls: {},
                metrics: {},
              },
            ],
          }),
          showOnboarding: () => true,
        },
      })

      expect(store.getters.items).toMatchInlineSnapshot(`
        Array [
          Object {
            "component": "OnboardingCheck",
            "isCompleted": false,
            "name": "First Steps",
          },
          Object {
            "component": "LoggingNotification",
            "isCompleted": true,
            "name": "Logging",
          },
          Object {
            "component": "MtlsNotification",
            "isCompleted": true,
            "name": "Zero-trust security",
          },
          Object {
            "component": "MetricsNotification",
            "isCompleted": true,
            "name": "Observability & Metrics",
          },
          Object {
            "component": "TracingNotification",
            "isCompleted": true,
            "name": " Tracking",
          },
        ]
      `)
    })
  })
})
