import { AxiosInstance, AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'

const MOCK_FILES_ROOT_PATH = './mock/responses'

const requireMockFile = (filename: MockFilename) => require(`${MOCK_FILES_ROOT_PATH}/${filename}`)

const mockFilenameBasePaths = [
  '/meshes',
  '/meshes/default',
  '/meshes/mesh-01',
  '/meshes/kong-mania-12',
  '/meshes/hello-world',
  '/meshes/default/dataplanes/test-dp-02',
  '/meshes/default/dataplanes/ingress-dp-test-123',
  '/meshes/default/dataplanes+insights/ingress-dp-test-123',
  '/meshes/default/dataplanes/gateway-dp-87qntx',
  '/meshes/default/dataplanes/dataplane-test-456',
  '/meshes/default/traffic-traces',
  '/meshes/default/traffic-traces/tt-1',
  '/meshes/default/traffic-traces/traffic-trace-02',
  '/traffic-traces',
  '/meshes/default/health-checks',
  '/meshes/default/health-checks/web-to-backend',
  '/meshes/default/health-checks/web-to-banana',
  '/meshes/default/health-checks/hello-health-check',
  '/meshes/default/health-checks/testing-health-checks',
  '/meshes/default/health-checks/health-check-0023',
  '/meshes/default/health-checks/health-check-12345',
  '/meshes/default/health-checks/foo-bar-baz-123',
  '/health-checks',
  '/meshes/default/fault-injections',
  '/meshes/default/fault-injections/web-to-backend.kuma-system',
  '/meshes/default/fault-injections/fi1.kuma-system',
  '/fault-injections',
  '/proxytemplates',
  '/meshes/default/proxytemplates',
  '/meshes/helloworld/proxytemplates',
  '/meshes/default/proxytemplates/pt-1',
  '/meshes/helloworld/proxytemplates/pt-123',
  '/meshes/default/traffic-logs',
  '/meshes/default/traffic-logs/tl-1',
  '/meshes/default/traffic-logs/tl-123',
  '/traffic-permissions',
  '/meshes/default/traffic-permissions',
  '/meshes/default/traffic-permissions/tp-1',
  '/meshes/default/traffic-permissions/tp-1234',
  '/meshes/default/traffic-permissions/tp-alpha-tango-donut',
  '/meshes/default/circuit-breakers',
  '/circuit-breakers',
  '/meshes/alpha-tango-mesh/circuit-breakers',
  '/meshes/default/circuit-breakers/cb1',
  '/meshes/default/circuit-breakers/cb2',
  '/status/zones',
  '/zones',
  '/zones+insights',
  '/zones+insights/zone-1',
  '/zones+insights/zone-2',
  '/zones+insights/zone-3',
  '/zones+insights/cluster-1',
  '/mesh-insights',
  '/service-insights',
  '/external-services',
  '/versions',
  '/meshes/default/dataplanes+insights/cluster-1.backend-02',
  '/meshes/default/dataplanes+insights/cluster-1.backend-03',
  '/meshes/default/dataplanes+insights/cluster-1.ingress-02',
  '/meshes/default/dataplanes+insights/cluster-1.gateway-01',
  '/meshes/default/dataplanes+insights/backend',
  '/meshes/default/dataplanes+insights/frontend',
  '/meshes/default/dataplanes+insights/db'
] as const

type MockFilename = typeof mockFilenameBasePaths[number]
  | 'dataplanes+insights__no-gateways-and-ingresses.json'
  | 'dataplanes+insights__only-gateways.json'
  | 'dataplanes+insights__only-ingresses.json'
  | 'dataplanes+insights.json'

export default class Mock {
  mock: MockAdapter

  constructor (axios: AxiosInstance) {
    this.mock = new MockAdapter(axios, { delayResponse: 0 })
  }

  setupPluginMocks () {
    this.mock
      .onAny()
      .passThrough()
  }

  withMockFile (config: AxiosRequestConfig) {
    try {
      return [200, require(`${MOCK_FILES_ROOT_PATH}${config.url}.json`)]
    } catch (_) {
      // TODO https://github.com/ctimmerm/axios-mock-adapter/pull/295
      return (this.mock as any).originalAdapter(config)
    }
  }

  setupMockEndpoints () {
    console.warn(
      '%c ✨You are mocking api requests.',
      'background: gray; color: white; display: block; padding: 0.25rem;'
    )

    const withMockFile = this.withMockFile.bind(this)

    mockFilenameBasePaths
      .reduce((acc, curr) => acc.onGet(curr).reply(withMockFile), this.mock)
      .onGet('/dataplanes+insights')
      .reply((config: AxiosRequestConfig) => {
        const { params = {} } = config
        const { gateway, ingress } = params

        if (gateway === false && ingress === false) {
          return [200, requireMockFile('dataplanes+insights__no-gateways-and-ingresses.json')]
        }

        if (gateway === true && !ingress) {
          return [200, requireMockFile('dataplanes+insights__only-gateways.json')]
        }

        if (ingress === true && !gateway) {
          return [200, requireMockFile('dataplanes+insights__only-ingresses.json')]
        }

        if (!gateway && !ingress) {
          return [200, requireMockFile('dataplanes+insights.json')]
        }

        return [200, {
          total: 0,
          items: [],
          next: null
        }]
      })
      .onAny()
      .passThrough()
  }
}
