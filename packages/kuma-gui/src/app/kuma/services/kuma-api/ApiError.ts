import type { components } from '@kumahq/kuma-http-api'

/**
 * Standard API error object following https://kong-aip.netlify.app/aip/193/.
 */
type AipError = components['schemas']['Error']

export class ApiError extends Error implements AipError {
  status: AipError['status']
  type: AipError['type']
  title: AipError['title']
  detail: AipError['detail']
  instance: AipError['instance']
  invalid_parameters: AipError['invalid_parameters']

  constructor({
    status,
    type = '',
    title,
    detail = '',
    instance = '',
    invalid_parameters = [],
  }: AipError) {
    super(title)

    this.name = 'ApiError'
    this.status = status
    this.type = type
    this.title = title
    this.detail = detail
    this.instance = instance
    this.invalid_parameters = invalid_parameters
  }

  toJSON() {
    return {
      status: this.status,
      type: this.type,
      title: this.title,
      detail: this.detail,
      instance: this.instance,
      invalid_parameters: this.invalid_parameters,
    }
  }

  toString() {
    return `${this.status}: ${this.detail}`
  }
}
