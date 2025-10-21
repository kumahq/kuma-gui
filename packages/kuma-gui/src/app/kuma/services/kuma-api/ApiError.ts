import type { components } from '@kumahq/kuma-http-api'

/**
 * Standard API error object following https://kong-aip.netlify.app/aip/193/.
 */
export type AipError = components['schemas']['Error']

export class ApiError extends Error implements AipError {
  status: AipError['status'] = 0
  type: AipError['type'] = ''
  title: AipError['title'] = ''
  detail: AipError['detail'] = ''
  instance: AipError['instance'] = ''
  invalid_parameters: AipError['invalid_parameters'] = []

  constructor({
    title = 'Unknown error',
    detail = 'An error has occurred while trying to load this data.',
    ...error
  }: AipError) {
    super(title)
    
    Object.assign(this, {
      name: 'ApiError',
      ...error,
      detail: error.status === 403 ? 'You currently don’t have access to this data.' : detail,
    })
  }
}
