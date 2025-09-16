import type { Dependencies, ResponseHandler } from '#mocks'
export default (_deps: Dependencies): ResponseHandler => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'TrafficTrace',
      mesh: params.mesh,
      name: params.name,
      creationTime: '2020-05-12T12:31:45.606217+02:00',
      modificationTime: '2020-05-12T12:31:45.606217+02:00',
      tracing: {
        defaultBackend: 'jaeger-collector',
      },
      selectors: [
        {
          match: {
            service: '*',
          },
        },
      ],
    },
  }
}
