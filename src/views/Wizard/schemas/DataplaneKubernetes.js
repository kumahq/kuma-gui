module.exports = {
  apiVersion: 'v1',
  kind: 'Namespace',
  metadata: {
    name: null,
    namespace: null,
    labels: {
      'kuma.io/sidecar-injection': 'enabled',
      'kuma.io/mesh': null
    }
  }
}
