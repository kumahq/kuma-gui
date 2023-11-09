import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const { mesh, name } = req.params

  let serviceType
  if (name.includes('gateway_builtin')) {
    serviceType = 'gateway_builtin'
  } else if (name.includes('gateway_delegated')) {
    serviceType = 'gateway_delegated'
  } else {
    serviceType = fake.kuma.serviceType()
  }

  const serviceInsight: any = {
    type: 'ServiceInsight',
    serviceType,
    mesh,
    name,
    creationTime: '2021-02-19T08:06:15.14624+01:00',
    modificationTime: '2021-02-19T08:07:37.539229+01:00',
  }

  if (serviceType === 'internal') {
    serviceInsight.addressPort = `${name}.mesh:${fake.internet.port()}`
    serviceInsight.status = fake.kuma.status()
    serviceInsight.dataplanes = fake.kuma.healthStatus()
  }

  return {
    headers: {},
    body: serviceInsight,
  }
}
