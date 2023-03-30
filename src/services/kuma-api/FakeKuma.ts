import { Faker } from '@faker-js/faker'

export class KumaModule {
  faker: Faker
  constructor(
    faker: Faker,
  ) {
    this.faker = faker
  }

  partition(min: number, max: number, length: number, sum: number): number[] {
    return Array.from(
      { length },
      (_, i) => {
        const smin = (length - i - 1) * min
        const smax = (length - i - 1) * max
        const offset = Math.max(sum - smax, min)
        const random = 1 + Math.min(sum - offset, max - offset, sum - smin - min)
        const value = Math.floor(Math.random() * random + offset)

        sum -= value
        return value
      },
    )
  }

  partitionInto(props: string[], total: number) {
    return this.partition(1, total, props.length, total).reduce((prev: Record<string, unknown>, item, i) => {
      prev[props[i]] = item
      return prev
    }, {})
  }

  serviceType() {
    return this.faker.helpers.arrayElement(
      [
        'internal',
        'external',
        // 'gateway_delegated',
        // 'gateway_builtin',
      ],
    )
  }

  status() {
    return this.faker.helpers.arrayElement(
      [
        'not_available',
        'partially_degraded',
        'offline',
        'online',
      ],
    )
  }

  protocol() {
    return this.faker.helpers.arrayElement(
      [
        'http',
        'grpc',
        'tcp',
        'kafka',
      ],
    )
  }
}
export default class FakeKuma extends Faker {
  kuma = new KumaModule(this)
}
