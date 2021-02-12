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
        type: null
      }
    ]
  },
  logging: {
    backends: [
      {
        name: null,
        format: '{ "destination": "%KUMA_DESTINATION_SERVICE%", "destinationAddress": "%UPSTREAM_LOCAL_ADDRESS%", "source": "%KUMA_SOURCE_SERVICE%", "sourceAddress": "%KUMA_SOURCE_ADDRESS%", "bytesReceived": "%BYTES_RECEIVED%", "bytesSent": "%BYTES_SENT%"}',
        type: null
      }
    ]
  },
  metrics: {
    enabledBackend: null,
    backends: [
      {
        name: null,
        type: null
      }
    ]
  }
}
