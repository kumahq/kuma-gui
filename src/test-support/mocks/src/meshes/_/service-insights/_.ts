import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const { mesh, name } = req.params
  const serviceType = (name as string).split('_')[1] ?? 'internal'

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
    serviceInsight.dataplanes = fake.kuma.dataPlaneProxyStatus()
  }

  return {
    headers: {},
    body: serviceInsight,
  }
}
