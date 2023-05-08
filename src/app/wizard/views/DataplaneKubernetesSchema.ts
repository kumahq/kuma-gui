export default {
  apiVersion: 'v1',
  kind: 'Namespace',
  metadata: {
    name: null,
    namespace: null,
    labels: {
      'kuma.io/sidecar-injection': 'enabled',
    },
    annotations: {
      'kuma.io/mesh': null,
    },
  },
}
