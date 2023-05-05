import type { EndpointDependencies, MockResponder } from '@/test-support'

export default (_deps: EndpointDependencies): MockResponder => (req) => {
  return {
    headers: {},
    body: {
      type: 'Zone',
      name: req.params.name,
      creationTime: '2021-02-19T08:06:15.380674+01:00',
      modificationTime: '2021-02-19T08:06:15.380674+01:00',
      enabled: true,
    },
  }
}
