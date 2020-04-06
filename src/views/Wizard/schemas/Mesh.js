module.exports = {
  environment: [
    {
      universal: {
        type: 'Mesh',
        metadata: {
          name: 'default'
        },
        spec: {
          mtls: {
            enabled: true,
            ca: {
              builtin: {}
            }
          },
          tracing: {
            defaultBackend: 'jaeger',
            backends: [
              {
                name: 'jaeger',
                sampling: 100,
                zipkin: {
                  url: 'http://jaeger-collector.kuma-tracing:9411/api/v1/spans'
                }
              }
            ]
          },
          metrics: {
            prometheus: {
              port: 5670,
              path: '/metrics'
            }
          },
          logging: {
            backends: [
              {
                name: 'logstash',
                format: '{"start_time": "%START_TIME%", "source": "%KUMA_SOURCE_SERVICE%", "destination": "%KUMA_DESTINATION_SERVICE%", "source_address": "%KUMA_SOURCE_ADDRESS_WITHOUT_PORT%", "destination_address": "%UPSTREAM_HOST%", "duration_millis": "%DURATION%", "bytes_received": "%BYTES_RECEIVED%", "bytes_sent": "%BYTES_SENT%"}',
                tcp: {
                  address: 'logstash.kuma-logging:5000'
                }
              }
            ]
          }
        }
      }
    },
    {
      kubernetes: {
        kind: 'Mesh',
        metadata: {
          name: 'default'
        },
        spec: {
          mtls: {
            enabled: true,
            ca: {
              builtin: {}
            }
          },
          tracing: {
            defaultBackend: 'jaeger',
            backends: [
              {
                name: 'jaeger',
                sampling: 100,
                zipkin: {
                  url: 'http://jaeger-collector.kuma-tracing:9411/api/v1/spans'
                }
              }
            ]
          },
          metrics: {
            prometheus: {
              port: 5670,
              path: '/metrics'
            }
          },
          logging: {
            backends: [
              {
                name: 'logstash',
                format: '{"start_time": "%START_TIME%", "source": "%KUMA_SOURCE_SERVICE%", "destination": "%KUMA_DESTINATION_SERVICE%", "source_address": "%KUMA_SOURCE_ADDRESS_WITHOUT_PORT%", "destination_address": "%UPSTREAM_HOST%", "duration_millis": "%DURATION%", "bytes_received": "%BYTES_RECEIVED%", "bytes_sent": "%BYTES_SENT%"}',
                tcp: {
                  address: 'logstash.kuma-logging:5000'
                }
              }
            ]
          }
        }
      }
    }
  ]
}
