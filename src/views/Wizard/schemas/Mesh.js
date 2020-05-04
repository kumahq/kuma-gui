// module.exports = {
//   type: 'Mesh', // or `kind` for Kubernetes
//   metadata: {
//     name: null
//   },
//   // `spec` is only present in Kubernetes
//   spec: {
//     mtls: {
//       enabled: true,
//       ca: {
//         builtin: {}
//       }
//     },
//     tracing: {
//       defaultBackend: null,
//       backends: [
//         {
//           name: null,
//           sampling: null,
//           zipkin: {
//             url: null
//           }
//         }
//       ]
//     },
//     metrics: {
//       prometheus: {
//         port: null,
//         path: null
//       }
//     },
//     logging: {
//       backends: [
//         {
//           name: null,
//           format: '{"start_time": "%START_TIME%", "source": "%KUMA_SOURCE_SERVICE%", "destination": "%KUMA_DESTINATION_SERVICE%", "source_address": "%KUMA_SOURCE_ADDRESS_WITHOUT_PORT%", "destination_address": "%UPSTREAM_HOST%", "duration_millis": "%DURATION%", "bytes_received": "%BYTES_RECEIVED%", "bytes_sent": "%BYTES_SENT%"}',
//           tcp: {
//             address: null
//           }
//         }
//       ]
//     }
//   }
// }

module.exports = {
  // name: null,
  // type: 'Mesh', // or `kind` for Kubernetes
  mtls: {
    enabledBackend: null,
    backends: []
  },
  tracing: {
    defaultBackend: null,
    backends: [
      {
        name: null,
        type: null,
        config: {}
      }
    ]
  },
  logging: {
    backends: [
      {
        name: null,
        format: '{ "destination": "%KUMA_DESTINATION_SERVICE%", "destinationAddress": "%UPSTREAM_LOCAL_ADDRESS%", "source": "%KUMA_SOURCE_SERVICE%", "sourceAddress": "%KUMA_SOURCE_ADDRESS%", "bytesReceived": "%BYTES_RECEIVED%", "bytesSent": "%BYTES_SENT%"}',
        type: null,
        config: {}
      }
    ]
  },
  metrics: {
    enabledBackend: null,
    backends: [
      {
        name: null,
        type: null,
        config: {}
      }
    ]
  }
}
