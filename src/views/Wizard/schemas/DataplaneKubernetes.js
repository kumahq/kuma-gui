module.exports = {
  apiVersion: 'v1',
  kind: 'Namespace',
  metadata: {
    name: null,
    labels: {
      'kuma.io/sidecar-injection': 'enabled'
    }
  }
}
