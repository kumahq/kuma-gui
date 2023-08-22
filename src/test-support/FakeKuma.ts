import { Faker } from '@faker-js/faker'

export class KumaModule {
  faker: Faker
  constructor(
    faker: Faker,
  ) {
    this.faker = faker
  }

  partition(min: number, max: number, length: number, sum: number): number[] {
    return Array.from(
      { length },
      (_, i) => {
        const smin = (length - i - 1) * min
        const smax = (length - i - 1) * max
        const offset = Math.max(sum - smax, min)
        const random = 1 + Math.min(sum - offset, max - offset, sum - smin - min)
        const value = Math.floor(Math.random() * random + offset)

        sum -= value
        return value
      },
    )
  }

  partitionInto(props: string[], total: number) {
    return this.partition(1, total, props.length, total).reduce((prev: Record<string, unknown>, item, i) => {
      prev[props[i]] = item
      return prev
    }, {})
  }

  serviceType() {
    return this.faker.helpers.arrayElement(
      [
        'internal',
        'external',
        // 'gateway_delegated',
        // 'gateway_builtin',
      ],
    )
  }

  serviceName(serviceType: string = 'internal') {
    const prefix = `${this.faker.hacker.noun()}_`

    if (serviceType === 'gateway_delegated' || serviceType === 'gateway_builtin') {
      return prefix + 'gateway'
    } else {
      return prefix + `${this.faker.hacker.noun()}_svc.mesh:80_${serviceType}`
    }
  }

  dataPlaneProxyName() {
    const namespace = this.faker.hacker.noun()
    const deploymentId = this.faker.string.hexadecimal({ length: 10, casing: 'lower', prefix: '' })
    const podId = this.faker.string.hexadecimal({ length: 5, casing: 'lower', prefix: '' })
    return `${this.faker.hacker.noun()}-${deploymentId}-${podId}.${namespace}`
  }

  status() {
    return this.faker.helpers.arrayElement(
      [
        'not_available',
        'partially_degraded',
        'offline',
        'online',
      ],
    )
  }

  protocol() {
    return this.faker.helpers.arrayElement(
      [
        'http',
        'grpc',
        'tcp',
        'kafka',
      ],
    )
  }

  subscriptionConfig() {
    return '{"apiServer":{"auth":{"allowFromLocalhost":true,"clientCertsDir":""},"corsAllowedDomains":[".*"],"http":{"enabled":true,"interface":"0.0.0.0","port":6681},"https":{"enabled":true,"interface":"0.0.0.0","port":6682,"tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key"},"readOnly":false},"bootstrapServer":{"apiVersion":"v3","params":{"adminAccessLogPath":"/dev/null","adminAddress":"127.0.0.1","adminPort":0,"xdsConnectTimeout":"1s","xdsHost":"","xdsPort":5678}},"defaults":{"skipMeshCreation":false},"diagnostics":{"debugEndpoints":false,"serverPort":6680},"dnsServer":{"CIDR":"240.0.0.0/4","domain":"mesh","port":5653},"dpServer":{"auth":{"type":"dpToken"},"hds":{"checkDefaults":{"healthyThreshold":1,"interval":"1s","noTrafficInterval":"1s","timeout":"2s","unhealthyThreshold":1},"enabled":true,"interval":"5s","refreshInterval":"10s"},"port":5678,"tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key"},"environment":"universal","general":{"dnsCacheTTL":"10s","tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key","workDir":"/Users/tomasz.wylezek/.kuma"},"guiServer":{"apiServerUrl":""},"metrics":{"dataplane":{"enabled":true,"idleTimeout":"5m0s","subscriptionLimit":2},"mesh":{"maxResyncTimeout":"20s","minResyncTimeout":"1s"},"zone":{"enabled":true,"idleTimeout":"5m0s","subscriptionLimit":10}},"mode":"zone","monitoringAssignmentServer":{"apiVersions":["v1"],"assignmentRefreshInterval":"1s","defaultFetchTimeout":"30s","grpcPort":0,"port":5676},"multizone":{"global":{"kds":{"grpcPort":5685,"maxMsgSize":10485760,"refreshInterval":"1s","tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key","zoneInsightFlushInterval":"10s"}},"zone":{"globalAddress":"grpcs://localhost:5685","kds":{"maxMsgSize":10485760,"refreshInterval":"1s","rootCaFile":""},"name":"cluster-1"}},"reports":{"enabled":true},"runtime":{"kubernetes":{"admissionServer":{"address":"","certDir":"","port":5443},"controlPlaneServiceName":"kuma-control-plane","injector":{"builtinDNS":{"enabled":true,"port":15053},"caCertFile":"","cniEnabled":false,"exceptions":{"labels":{"openshift.io/build.name":"*","openshift.io/deployer-pod-for.name":"*"}},"initContainer":{"image":"kuma/kuma-init:latest"},"sidecarContainer":{"adminPort":9901,"drainTime":"30s","envVars":{},"gid":5678,"image":"kuma/kuma-dp:latest","livenessProbe":{"failureThreshold":12,"initialDelaySeconds":60,"periodSeconds":5,"timeoutSeconds":3},"readinessProbe":{"failureThreshold":12,"initialDelaySeconds":1,"periodSeconds":5,"successThreshold":1,"timeoutSeconds":3},"redirectPortInbound":15006,"redirectPortInboundV6":15010,"redirectPortOutbound":15001,"resources":{"limits":{"cpu":"1000m","memory":"512Mi"},"requests":{"cpu":"50m","memory":"64Mi"}},"uid":5678},"sidecarTraffic":{"excludeInboundPorts":[],"excludeOutboundPorts":[]},"virtualProbesEnabled":true,"virtualProbesPort":9000},"marshalingCacheExpirationTime":"5m0s"},"universal":{"dataplaneCleanupAge":"72h0m0s"}},"store":{"cache":{"enabled":true,"expirationTime":"1s"},"kubernetes":{"systemNamespace":"kuma-system"},"postgres":{"connectionTimeout":5,"dbName":"kuma","host":"127.0.0.1","maxIdleConnections":0,"maxOpenConnections":0,"maxReconnectInterval":"1m0s","minReconnectInterval":"10s","password":"*****","port":15432,"tls":{"caPath":"","certPath":"","keyPath":"","mode":"disable"},"user":"kuma"},"type":"memory","upsert":{"conflictRetryBaseBackoff":"100ms","conflictRetryMaxTimes":5}},"xdsServer":{"dataplaneConfigurationRefreshInterval":"1s","dataplaneStatusFlushInterval":"10s","nackBackoff":"5s"}}'
  }

  /**
   * Returns a random DPP (or gateway) status object with self-consistent values (i.e. total = online + partiallyDegraded + offline).
   */
  dataPlaneProxyStatus(maxTotal: number = 30) {
    const total = this.faker.number.int({ min: 1, max: maxTotal })
    const online = this.faker.number.int({ min: 0, max: total })
    const partiallyDegraded = this.faker.number.int({ min: 0, max: total - online })
    const offline = total - online - partiallyDegraded

    const values = [
      ['total', total],
      ['online', online],
      ['partiallyDegraded', partiallyDegraded],
      ['offline', offline],
    ].filter(([_key, value]) => value !== 0)

    return Object.fromEntries(values)
  }

  /**
   * Returns a random service status object with self-consistent values (i.e. total = internal + external).
   */
  serviceStatus(maxTotal: number = 30) {
    const total = this.faker.number.int({ min: 1, max: maxTotal })
    const internal = this.faker.number.int({ min: 0, max: total })
    const external = total - internal

    const values = [
      ['total', total],
      ['internal', internal],
      ['external', external],
    ].filter(([_key, value]) => value !== 0)

    return Object.fromEntries(values)
  }

  /**
   * Returns a random policy type status object.
   */
  policyTypeStatus(maxTotal: number = 10) {
    const total = this.faker.number.int({ min: 0, max: maxTotal })

    const values = [
      ['total', total],
    ]

    return Object.fromEntries(values)
  }

  inbound(service: string, zone?: string) {
    return {
      ...(this.faker.datatype.boolean() && {
        health: {
          ready: this.faker.datatype.boolean(),
        },
      }),
      port: this.faker.internet.port(),
      servicePort: this.faker.internet.port(),
      serviceAddress: this.faker.internet.ip(),
      tags: {
        'kuma.io/protocol': this.protocol(),
        'kuma.io/service': service,
        ...(zone && {
          'kuma.io/zone': zone,
        }),
      },
    }
  }
}
export default class FakeKuma extends Faker {
  kuma = new KumaModule(this)
}
