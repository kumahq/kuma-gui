import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

export default (_dependencies: Dependencies): ResponseHandler => (request) => {
  const kri = request.params.kri as string | undefined
  const [
    shortName = '',
  ] = kri?.split('_').slice(1) ?? ''

  return {
    headers: {
      'Status-Code': '404',
    },
    body: {
      status: 404,
      title: 'Not Found',
      detail: 'No mock available for this resource. Choose a different KRI that matches an available resource.',
      instance: 'kuma:trace:generic-kri-api',
      type: 'https://httpstatuses.com/404',
      invalid_parameters: [
        {
          field: 'kri',
          reason: `The provided KRI includes a [shortName] ([resourceType]) that is not supported in the mock API. Given [${shortName}] is not supported yet.`,
        }        
      ]
    } satisfies components['schemas']['Error']
  }
}
