type ApiErrorCause = {
  field: string
  message: string
}

type ApiErrorConstructorOptions = {
  title?: string | null,
  message: string,
  code?: string | null,
  statusCode: number,
  causes?: ApiErrorCause[] | null
}

export class ApiError extends Error {
  title: string | null
  code: string | null
  causes: ApiErrorCause[] | null
  statusCode: number

  constructor({ title = null, message, code = null, statusCode, causes = null }: ApiErrorConstructorOptions) {
    super(message)

    this.name = 'ApiError'
    this.title = title
    this.code = code
    this.statusCode = statusCode
    this.causes = causes
  }

  toJSON() {
    return {
      name: this.name,
      title: this.title,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      causes: this.causes,
    }
  }
}
