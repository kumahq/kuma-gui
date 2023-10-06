import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env }: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      access: {
        static: {
          adminResources: {
            groups: ['mesh-system:admin'],
            users: ['mesh-system:admin'],
          },
          generateDpToken: {
            groups: ['mesh-system:admin'],
            users: ['mesh-system:admin'],
          },
          generateUserToken: {
            groups: ['mesh-system:admin'],
            users: ['mesh-system:admin'],
          },
        },
        type: 'static',
      },
      apiServer: {
        auth: {
          clientCertsDir: '',
        },
        authn: {
          localhostIsAdmin: true,
          tokens: {
            bootstrapAdminToken: true,
          },
          type: 'tokens',
        },
        corsAllowedDomains: ['.*'],
        http: {
          enabled: true,
          interface: '0.0.0.0',
          port: 5681,
        },
        https: {
          enabled: true,
          interface: '0.0.0.0',
          port: 5682,
          tlsCertFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.crt',
          tlsKeyFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.key',
        },
        readOnly: false,
      },
      bootstrapServer: {
        params: {
          adminAccessLogPath: '/dev/null',
          adminAddress: '127.0.0.1',
          adminPort: 0,
          xdsConnectTimeout: '1s',
          xdsHost: '',
          xdsPort: 5678,
        },
      },
      defaults: {
        skipMeshCreation: false,
      },
      diagnostics: {
        debugEndpoints: false,
        serverPort: 5680,
      },
      dnsServer: {
        CIDR: '240.0.0.0/4',
        domain: 'mesh',
        port: 5653,
        serviceVipEnabled: true,
      },
      dpServer: {
        auth: {
          type: 'dpToken',
        },
        hds: {
          checkDefaults: {
            healthyThreshold: 1,
            interval: '1s',
            noTrafficInterval: '1s',
            timeout: '2s',
            unhealthyThreshold: 1,
          },
          enabled: true,
          interval: '5s',
          refreshInterval: '10s',
        },
        port: 5678,
        tlsCertFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.crt',
        tlsKeyFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.key',
      },
      environment: 'universal',
      experimental: {},
      general: {
        dnsCacheTTL: '10s',
        tlsCertFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.crt',
        tlsKeyFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.key',
        workDir: '/Users/tomasz.wylezek/.kuma',
      },
      guiServer: {
        apiServerUrl: '',
      },
      metrics: {
        dataplane: {
          idleTimeout: '5m0s',
          subscriptionLimit: 2,
        },
        mesh: {
          maxResyncTimeout: '20s',
          minResyncTimeout: '1s',
        },
        zone: {
          idleTimeout: '5m0s',
          subscriptionLimit: 10,
        },
      },
      mode: env('KUMA_MODE', 'global') === 'global' ? 'global' : 'standalone',
      monitoringAssignmentServer: {
        apiVersions: ['v1'],
        assignmentRefreshInterval: '1s',
        defaultFetchTimeout: '30s',
        grpcPort: 0,
        port: 5676,
      },
      multizone: {
        global: {
          kds: {
            grpcPort: 5685,
            maxMsgSize: 10485760,
            refreshInterval: '1s',
            tlsCertFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.crt',
            tlsKeyFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.key',
            zoneInsightFlushInterval: '10s',
          },
        },
        zone: {
          kds: {
            maxMsgSize: 10485760,
            refreshInterval: '1s',
            rootCaFile: '',
          },
        },
      },
      reports: {
        enabled: true,
      },
      runtime: {
        kubernetes: {
          admissionServer: {
            address: '',
            certDir: '',
            port: 5443,
          },
          controlPlaneServiceName: 'kuma-control-plane',
          injector: {
            builtinDNS: {
              enabled: true,
              port: 15053,
            },
            caCertFile: '',
            cniEnabled: false,
            exceptions: {
              labels: {
                'openshift.io/build.name': '*',
                'openshift.io/deployer-pod-for.name': '*',
              },
            },
            initContainer: {
              image: 'kuma/kuma-init:latest',
            },
            sidecarContainer: {
              adminPort: 9901,
              drainTime: '30s',
              envVars: {},
              gid: 5678,
              image: 'kuma/kuma-dp:latest',
              livenessProbe: {
                failureThreshold: 12,
                initialDelaySeconds: 60,
                periodSeconds: 5,
                timeoutSeconds: 3,
              },
              readinessProbe: {
                failureThreshold: 12,
                initialDelaySeconds: 1,
                periodSeconds: 5,
                successThreshold: 1,
                timeoutSeconds: 3,
              },
              redirectPortInbound: 15006,
              redirectPortInboundV6: 15010,
              redirectPortOutbound: 15001,
              resources: {
                limits: {
                  cpu: '1000m',
                  memory: '512Mi',
                },
                requests: {
                  cpu: '50m',
                  memory: '64Mi',
                },
              },
              uid: 5678,
            },
            sidecarTraffic: {
              excludeInboundPorts: [],
              excludeOutboundPorts: [],
            },
            virtualProbesEnabled: true,
            virtualProbesPort: 9000,
          },
          marshalingCacheExpirationTime: '5m0s',
          serviceAccountName: 'system:serviceaccount:kuma-system:kuma-control-plane',
        },
        universal: {
          dataplaneCleanupAge: '72h0m0s',
        },
      },
      store: {
        cache: {
          enabled: true,
          expirationTime: '1s',
        },
        kubernetes: {
          systemNamespace: 'kuma-system',
        },
        postgres: {
          connectionTimeout: 5,
          dbName: 'kuma',
          host: '127.0.0.1',
          maxIdleConnections: 50,
          maxOpenConnections: 50,
          maxReconnectInterval: '1m0s',
          minReconnectInterval: '10s',
          password: '*****',
          port: 15432,
          tls: {
            caPath: '',
            certPath: '',
            keyPath: '',
            mode: 'disable',
          },
          user: 'kuma',
        },
        type: env('KUMA_STORE_TYPE', 'memory'),
        upsert: {
          conflictRetryBaseBackoff: '100ms',
          conflictRetryMaxTimes: 5,
        },
      },
      xdsServer: {
        dataplaneConfigurationRefreshInterval: '1s',
        dataplaneStatusFlushInterval: '10s',
        nackBackoff: '5s',
      },
    },
  }
}
