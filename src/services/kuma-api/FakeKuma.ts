import { Faker } from '@faker-js/faker'

export class KumaModule {
  faker: Faker
  constructor(
    faker: Faker,
  ) {
    this.faker = faker
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
