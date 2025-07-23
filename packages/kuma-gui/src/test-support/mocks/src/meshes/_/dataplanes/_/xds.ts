import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const query = req.url.searchParams
  const { name } = req.params
  const eds = query.get('include_eds') === 'true'

  // use a seed based on the name to keep ports and ip address the same across
  // _overview, stats and rules
  fake.kuma.seed(name as string)
  const inboundCount = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const ports = Array.from({ length: inboundCount }).map(() => ({
    port: fake.number.int({ min: 1, max: 65535 }),
    protocol: fake.kuma.protocol(),
  }))
  const address = fake.internet.ip()
  const serviceCount = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 7, max: 50 })}`))
  const services = Array.from({ length: serviceCount }).map(() => {
    if (fake.datatype.boolean()) {
      return `${fake.word.noun()}_${fake.word.noun()}_${fake.word.noun()}_${fake.word.noun()}_${fake.helpers.arrayElement(['msvc', 'mzsvc', 'extsvc'])}_${fake.number.int({ min: 1, max: 65535 })}`
    } else {
      return `${fake.word.noun()}_svc_${fake.number.int({ min: 1, max: 65535 })}`
    }
  })
  if (env('KUMA_CLUSTER_NAME', '').length > 0) {
    services[0] = env('KUMA_CLUSTER_NAME', '')
  }
  //

  fake.kuma.seed()

  return {
    headers: {},
    body: {
      configs: [
        {
          '@type': 'type.googleapis.com/envoy.admin.v3.BootstrapConfigDump',
          bootstrap: {
            node: {
              id: 'default.demo-app-b4f98898-lrnr8.kuma-demo',
              cluster: 'demo-app_kuma-demo_svc_5000',
              metadata: {
                'dataplane.proxyType': 'dataplane',
                'dataplane.admin.address': '127.0.0.1',
                version: {
                  envoy: {
                    kumaDpCompatible: true,
                    build: '810bfcb8cae456e3a5e6541a0ee853185e2586f7/1.30.6/Modified/RELEASE/BoringSSL',
                    version: '1.30.6',
                  },
                  kumaDp: {
                    gitCommit: 'local-build',
                    buildDate: 'local-build',
                    version: '0.0.0-preview.vlocal-build',
                    gitTag: 'local-build',
                  },
                },
                'dataplane.readinessReporter.port': '9902',
                workdir: '/tmp/kuma-dp-3143364667',
                features: [
                  'feature-tcp-accesslog-via-named-pipe',
                ],
                metricsKeyPath: '',
                'dataplane.appProbeProxy.enabled': 'true',
                systemCaPath: '/etc/ssl/certs/ca-certificates.crt',
                metricsCertPath: '',
                'dataplane.admin.port': '9901',
                'dataplane.dns.port': '15055',
              },
              user_agent_name: 'envoy',
              user_agent_build_version: {
                version: {
                  major_number: 1,
                  minor_number: 30,
                  patch: 6,
                },
                metadata: {
                  'revision.status': 'Modified',
                  'revision.sha': '810bfcb8cae456e3a5e6541a0ee853185e2586f7',
                  'build.type': 'RELEASE',
                  'ssl.version': 'BoringSSL',
                },
              },
              extensions: Array.from({ length: fake.number.int({ min: 300, max: 450 }) }).map(_ => (
                {
                  name: 'envoy.rbac.matchers.upstream_ip_port',
                  category: 'envoy.rbac.matchers',
                  type_urls: [
                    'envoy.extensions.rbac.matchers.upstream_ip_port.v3.UpstreamIpPortMatcher',
                  ],
                }
              )),
            },
            static_resources: {
              clusters: [
                {
                  name: 'access_log_sink',
                  type: 'STATIC',
                  connect_timeout: '1s',
                  upstream_connection_options: {
                    tcp_keepalive: {
                      keepalive_probes: 3,
                      keepalive_time: 10,
                      keepalive_interval: 10,
                    },
                  },
                  load_assignment: {
                    cluster_name: 'access_log_sink',
                    endpoints: [
                      {
                        lb_endpoints: [
                          {
                            endpoint: {
                              address: {
                                pipe: {
                                  path: '/tmp/kuma-dp-3143364667/kuma-al-demo-app-b4f98898-lrnr8.kuma-demo-default.sock',
                                },
                              },
                            },
                          },
                        ],
                      },
                    ],
                  },
                  typed_extension_protocol_options: {
                    'envoy.extensions.upstreams.http.v3.HttpProtocolOptions': {
                      '@type': 'type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions',
                      explicit_http_config: {
                        http2_protocol_options: {},
                      },
                    },
                  },
                },
              ],
              secrets: [
                {
                  name: 'cp_validation_ctx',
                  validation_context: {
                    trusted_ca: {
                      inline_bytes: fake.kuma.certificate(),
                    },
                    match_typed_subject_alt_names: [
                      {
                        san_type: 'DNS',
                        matcher: {
                          exact: 'kuma-control-plane.kuma-system',
                        },
                      },
                      {
                        san_type: 'IP_ADDRESS',
                        matcher: {
                          exact: 'kuma-control-plane.kuma-system',
                        },
                      },
                    ],
                  },
                },
              ],
            },
            dynamic_resources: {
              lds_config: {
                ads: {},
                initial_fetch_timeout: '0s',
                resource_api_version: 'V3',
              },
              cds_config: {
                ads: {},
                initial_fetch_timeout: '0s',
                resource_api_version: 'V3',
              },
              ads_config: {
                api_type: 'gRPC',
                grpc_services: [
                  {
                    google_grpc: {
                      target_uri: 'kuma-control-plane.kuma-system:5678',
                      channel_credentials: {
                        ssl_credentials: {
                          root_certs: {
                            inline_bytes: fake.kuma.certificate(),
                          },
                        },
                      },
                      call_credentials: [
                        {
                          from_plugin: {
                            name: 'envoy.grpc_credentials.file_based_metadata',
                            typed_config: {
                              '@type': 'type.googleapis.com/envoy.config.grpc_credential.v3.FileBasedMetadataConfig',
                              secret_data: {
                                filename: '[redacted]',
                              },
                            },
                          },
                        },
                      ],
                      stat_prefix: 'ads',
                      credentials_factory_name: 'envoy.grpc_credentials.file_based_metadata',
                    },
                  },
                ],
                set_node_on_first_message_only: true,
                transport_api_version: 'V3',
              },
            },
            admin: {
              address: {
                socket_address: {
                  address: '127.0.0.1',
                  port_value: 9901,
                },
              },
              access_log: [
                {
                  name: 'envoy.access_loggers.file',
                  typed_config: {
                    '@type': 'type.googleapis.com/envoy.extensions.access_loggers.file.v3.FileAccessLog',
                    path: '/dev/null',
                  },
                },
              ],
            },
            stats_config: {
              stats_tags: [
                {
                  tag_name: 'name',
                  regex: '^grpc\\.((.+)\\.)',
                },
                {
                  tag_name: 'status',
                  regex: '^grpc.*streams_closed(_([0-9]+))',
                },
                {
                  tag_name: 'kafka_name',
                  regex: '^kafka(\\.(\\S*[0-9]))\\.',
                },
                {
                  tag_name: 'kafka_type',
                  regex: '^kafka\\..*\\.(.*?(?=_duration|$))',
                },
                {
                  tag_name: 'worker',
                  regex: '(worker_([0-9]+)\\.)',
                },
                {
                  tag_name: 'listener',
                  regex: '((.+?)\\.)rbac\\.',
                },
              ],
            },
            layered_runtime: {
              layers: [
                {
                  name: 'kuma',
                  static_layer: {
                    're2.max_program_size.error_level': '4294967295',
                    're2.max_program_size.warn_level': 1000,
                  },
                },
              ],
            },
            default_regex_engine: {
              name: 'envoy.regex_engines.google_re2',
              typed_config: {
                '@type': 'type.googleapis.com/envoy.extensions.regex_engines.v3.GoogleRE2',
              },
            },
          },
          last_updated: '2024-11-11T12:27:04.416Z',
        },
        {
          '@type': 'type.googleapis.com/envoy.admin.v3.ClustersConfigDump',
          version_info: 'd098a1fa-782b-46bb-b47a-f10e799bd5aa',
          static_clusters: [
            {
              cluster: {
                '@type': 'type.googleapis.com/envoy.config.cluster.v3.Cluster',
                name: 'access_log_sink',
                type: 'STATIC',
                connect_timeout: '1s',
                upstream_connection_options: {
                  tcp_keepalive: {
                    keepalive_probes: 3,
                    keepalive_time: 10,
                    keepalive_interval: 10,
                  },
                },
                load_assignment: {
                  cluster_name: 'access_log_sink',
                  endpoints: [
                    {
                      lb_endpoints: [
                        {
                          endpoint: {
                            address: {
                              pipe: {
                                path: '/tmp/kuma-dp-3143364667/kuma-al-demo-app-b4f98898-lrnr8.kuma-demo-default.sock',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                typed_extension_protocol_options: {
                  'envoy.extensions.upstreams.http.v3.HttpProtocolOptions': {
                    '@type': 'type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions',
                    explicit_http_config: {
                      http2_protocol_options: {},
                    },
                  },
                },
              },
              last_updated: '2024-11-11T12:27:04.433Z',
            },
          ],
          dynamic_active_clusters: [
            {
              version_info: 'd098a1fa-782b-46bb-b47a-f10e799bd5aa',
              cluster: {
                '@type': 'type.googleapis.com/envoy.config.cluster.v3.Cluster',
                name: 'default_demo-app_kuma-demo_default_msvc_5000',
                type: 'EDS',
                eds_cluster_config: {
                  eds_config: {
                    ads: {},
                    resource_api_version: 'V3',
                  },
                },
                connect_timeout: '5s',
                circuit_breakers: {
                  thresholds: [
                    {
                      max_connections: 1024,
                      max_pending_requests: 1024,
                      max_requests: 1024,
                      max_retries: 3,
                    },
                  ],
                },
                typed_extension_protocol_options: {
                  'envoy.extensions.upstreams.http.v3.HttpProtocolOptions': {
                    '@type': 'type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions',
                    explicit_http_config: {
                      http2_protocol_options: {},
                    },
                  },
                },
              },
              last_updated: '2024-11-18T09:56:27.782Z',
            },
          ],
        },
        ...(eds
          ? [{
            '@type': 'type.googleapis.com/envoy.admin.v3.EndpointsConfigDump',
            static_endpoint_configs: [
              {
                endpoint_config: {
                  '@type': 'type.googleapis.com/envoy.config.endpoint.v3.ClusterLoadAssignment',
                  cluster_name: 'access_log_sink',
                  endpoints: [
                    {
                      locality: {},
                      lb_endpoints: [
                        {
                          endpoint: {
                            address: {
                              pipe: {
                                path: '/tmp/kuma-dp-3143364667/kuma-al-demo-app-b4f98898-lrnr8.kuma-demo-default.sock',
                              },
                            },
                            health_check_config: {},
                          },
                          health_status: 'HEALTHY',
                          load_balancing_weight: 1,
                        },
                      ],
                      load_balancing_weight: 0,
                    },
                  ],
                  policy: {
                    overprovisioning_factor: 140,
                  },
                },
              },
            ],
            dynamic_endpoint_configs: services.map((item) => {
              return {
                endpoint_config: {
                  '@type': 'type.googleapis.com/envoy.config.endpoint.v3.ClusterLoadAssignment',
                  cluster_name: item,
                  policy: {
                    overprovisioning_factor: 140,
                  },
                },
              }
            }),
          }]
          : []),
        {
          '@type': 'type.googleapis.com/envoy.admin.v3.ListenersConfigDump',
          version_info: '1a86643e-61fb-4d08-9dba-14b5e91bb697',
          dynamic_active_clusters: services.map((item) => {
            return {
              version_info: 'd3abaa95-216a-4d2b-a70f-cb87011f59c1',
              cluster: {
                '@type': 'type.googleapis.com/envoy.config.cluster.v3.Cluster',
                name: item,
                type: 'EDS',
                eds_cluster_config: {
                  eds_config: {
                    ads: {},
                    resource_api_version: 'V3',
                  },
                },
                connect_timeout: '5s',
                circuit_breakers: {
                  thresholds: [
                    {
                      max_connections: 1024,
                      max_pending_requests: 1024,
                      max_requests: 1024,
                      max_retries: 3,
                    },
                  ],
                },
                typed_extension_protocol_options: {
                  'envoy.extensions.upstreams.http.v3.HttpProtocolOptions': {
                    '@type': 'type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions',
                    explicit_http_config: {
                      http2_protocol_options: {},
                    },
                  },
                },
              },
              last_updated: '2024-11-15T16:45:51.489Z',
            }
          }),
          dynamic_listeners: ports.map((item) => (
            {
              name: `inbound:${address}:${item.port}`,
              // name: 'inbound:passthrough:ipv4',
              active_state: {
                version_info: '9ece210f-6fed-44c8-b2ac-168156c698e1',
                listener: {
                  '@type': 'type.googleapis.com/envoy.config.listener.v3.Listener',
                  name: `inbound:${address}:${item.port}`,
                  address: {
                    socket_address: {
                      address,
                      port_value: item.port,
                    },
                  },
                  filter_chains: [
                    {
                      filters: [
                        {
                          name: 'envoy.filters.network.http_connection_manager',
                          typed_config: {
                            '@type': 'type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager',
                            stat_prefix: `localhost_${item.port}`,
                            route_config: {
                              name: `inbound:demo-app_kuma-demo_svc_${item.port}`,
                              virtual_hosts: [
                                {
                                  name: `demo-app_kuma-demo_svc_${item.port}`,
                                  domains: [
                                    '*',
                                  ],
                                  routes: [
                                    {
                                      match: {
                                        prefix: '/',
                                      },
                                      route: {
                                        cluster: `localhost:${item.port}`,
                                        timeout: '0s',
                                        idle_timeout: '3600s',
                                      },
                                    },
                                  ],
                                },
                              ],
                              validate_clusters: false,
                              request_headers_to_remove: [
                                'x-kuma-tags',
                              ],
                            },
                            http_filters: [
                              {
                                name: 'envoy.filters.http.router',
                                typed_config: {
                                  '@type': 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router',
                                },
                              },
                            ],
                            forward_client_cert_details: 'SANITIZE_SET',
                            set_current_client_cert_details: {
                              uri: true,
                            },
                            stream_idle_timeout: '3600s',
                            common_http_protocol_options: {
                              idle_timeout: '0s',
                            },
                            request_headers_timeout: '0s',
                          },
                        },
                      ],
                    },
                  ],
                  metadata: {
                    filter_metadata: {
                      'io.kuma.tags': {
                        'kuma.io/protocol': 'http',
                        'kuma.io/zone': 'default',
                        'pod-template-hash': 'b4f98898',
                        'kubernetes.io/hostname': 'k3d-kuma-server-0',
                        'k8s.kuma.io/service-name': 'demo-app',
                        app: 'demo-app',
                        'kuma.io/service': `demo-app_kuma-demo_svc_${item.port}`,
                        'k8s.kuma.io/namespace': 'kuma-demo',
                        'k8s.kuma.io/service-port': `${item.port}`,
                      },
                    },
                  },
                  traffic_direction: 'INBOUND',
                  bind_to_port: false,
                  enable_reuse_port: false,
                },
                last_updated: '2024-11-11T12:27:04.714Z',
              },
            }
          )),
        },
        {
          '@type': 'type.googleapis.com/envoy.admin.v3.ScopedRoutesConfigDump',
        },
        {
          '@type': 'type.googleapis.com/envoy.admin.v3.RoutesConfigDump',
          static_route_configs: [
            {
              route_config: {
                '@type': 'type.googleapis.com/envoy.config.route.v3.RouteConfiguration',
                virtual_hosts: [
                  {
                    name: 'kuma:envoy:admin',
                    domains: [
                      '*',
                    ],
                    routes: [
                      {
                        match: {
                          prefix: '/ready',
                        },
                        route: {
                          cluster: 'kuma:readiness',
                          prefix_rewrite: '/ready',
                        },
                      },
                    ],
                  },
                ],
                validate_clusters: false,
              },
              last_updated: '2024-11-11T12:27:04.725Z',
            },
            {
              route_config: {
                '@type': 'type.googleapis.com/envoy.config.route.v3.RouteConfiguration',
                name: 'inbound:demo-app_kuma-demo_svc_5000',
                virtual_hosts: [
                  {
                    name: 'demo-app_kuma-demo_svc_5000',
                    domains: [
                      '*',
                    ],
                    routes: [
                      {
                        match: {
                          prefix: '/',
                        },
                        route: {
                          cluster: 'localhost:5000',
                          timeout: '0s',
                          idle_timeout: '3600s',
                        },
                      },
                    ],
                  },
                ],
                validate_clusters: false,
                request_headers_to_remove: [
                  'x-kuma-tags',
                ],
              },
              last_updated: '2024-11-11T12:27:04.712Z',
            },
            {
              route_config: {
                '@type': 'type.googleapis.com/envoy.config.route.v3.RouteConfiguration',
                name: 'outbound:default_demo-app_kuma-demo_default_msvc_5000',
                virtual_hosts: [
                  {
                    name: 'default_demo-app_kuma-demo_default_msvc_5000',
                    domains: [
                      '*',
                    ],
                    routes: [
                      {
                        match: {
                          prefix: '/',
                        },
                        route: {
                          cluster: 'default_demo-app_kuma-demo_default_msvc_5000',
                          timeout: '15s',
                          retry_policy: {
                            retry_on: 'gateway-error,connect-failure,refused-stream',
                            num_retries: 5,
                            per_try_timeout: '16s',
                            retry_back_off: {
                              base_interval: '0.025s',
                              max_interval: '0.250s',
                            },
                          },
                          idle_timeout: '1800s',
                        },
                        name: '9Zuf5Tg79OuZcQITwBbQykxAk2u4fRKrwYn3//AL4Yo=',
                      },
                    ],
                  },
                ],
                request_headers_to_add: [
                  {
                    header: {
                      key: 'x-kuma-tags',
                      value: '&app=demo-app&&k8s.kuma.io/namespace=kuma-demo&&k8s.kuma.io/service-name=demo-app&&k8s.kuma.io/service-port=5000&&kubernetes.io/hostname=k3d-kuma-server-0&&kuma.io/protocol=http&&kuma.io/service=demo-app_kuma-demo_svc_5000&&kuma.io/zone=default&&pod-template-hash=b4f98898&',
                    },
                  },
                ],
                validate_clusters: false,
              },
              last_updated: '2024-11-14T12:12:36.248Z',
            },
            {
              route_config: {
                '@type': 'type.googleapis.com/envoy.config.route.v3.RouteConfiguration',
                virtual_hosts: [
                  {
                    name: 'kuma:envoy:admin',
                    domains: [
                      '*',
                    ],
                    routes: [
                      {
                        match: {
                          prefix: '/ready',
                        },
                        route: {
                          cluster: 'kuma:readiness',
                          prefix_rewrite: '/ready',
                        },
                      },
                      {
                        match: {
                          prefix: '/',
                        },
                        route: {
                          cluster: 'kuma:envoy:admin',
                          prefix_rewrite: '/',
                        },
                      },
                    ],
                  },
                ],
                validate_clusters: false,
              },
              last_updated: '2024-11-14T18:42:13.028Z',
            },
          ],
        },
        {
          '@type': 'type.googleapis.com/envoy.admin.v3.SecretsConfigDump',
          static_secrets: [
            {
              name: 'cp_validation_ctx',
              secret: {
                '@type': 'type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.Secret',
                name: 'cp_validation_ctx',
                validation_context: {
                  trusted_ca: {
                    inline_bytes: fake.kuma.certificate(),
                  },
                  match_typed_subject_alt_names: [
                    {
                      san_type: 'DNS',
                      matcher: {
                        exact: 'kuma-control-plane.kuma-system',
                      },
                    },
                    {
                      san_type: 'IP_ADDRESS',
                      matcher: {
                        exact: 'kuma-control-plane.kuma-system',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],

    },
  }
}
