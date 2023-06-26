export interface InvalidParameter {
  field: string
  reason: string
  rule?: string
  choices?: string[]
}

type ApiErrorConstructorOptions = {
  status: number
  type?: string | null
  title: string
  detail?: string | null
  instance?: string | null
  invalidParameters?: InvalidParameter[]
}

/**
 * Standard API error object following https://kong-aip.netlify.app/aip/193/.
 */
export class ApiError extends Error {
  status: number
  type: string | null
  title: string
  detail: string | null
  instance: string | null
  invalidParameters: InvalidParameter[]

  constructor({
    status,
    type = null,
    title,
    detail = null,
    instance = null,
    invalidParameters = [],
  }: ApiErrorConstructorOptions) {
    super(title)

    this.name = 'ApiError'
    this.status = status
    this.type = type
    this.title = title
    this.detail = detail
    this.instance = instance
    this.invalidParameters = invalidParameters
  }

  toJSON() {
    return {
      status: this.status,
      type: this.type,
      title: this.title,
      detail: this.detail,
      instance: this.instance,
      invalidParameters: this.invalidParameters,
    }
  }
}
