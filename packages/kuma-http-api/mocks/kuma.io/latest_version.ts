import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake }: Dependencies): ResponseHandler => (_req) => {
  fake.kuma.seed('')
  return {
    headers: {},
    body: fake.helpers.arrayElement(['2.1.0', '5.1.0']),
  }
}
