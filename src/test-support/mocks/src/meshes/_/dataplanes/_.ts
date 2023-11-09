import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, env }: EndpointDependencies): MockResponder => (req) => {
  const { mesh, name } = req.params

  const inbounds = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  let type: 'gateway_builtin' | 'gateway_delegated' | 'proxy' = 'proxy'
  if (name.includes('-gateway_builtin')) {
    type = 'gateway_builtin'
  } else if (name.includes('-gateway_delegated')) {
    type = 'gateway_delegated'
  }

  const isMultizone = true && fake.datatype.boolean()

  return {
    headers: {},
    body: {
      type: 'Dataplane',
      mesh,
      name,
      creationTime: '2021-02-17T08:33:36.442044+01:00',
      modificationTime: '2021-02-17T08:33:36.442044+01:00',
      networking: fake.kuma.dataplaneNetworking({ type, inbounds, isMultizone }),
    },
  }
}
