module.exports = {
  apiVersion: 'v1',
  kind: 'Namespace',
  metadata: {
    name: null,
    namespace: null,
    annotations: {
      'kuma.io/sidecar-injection': 'enabled',
      'kuma.io/mesh': null,
    },
  },
}
