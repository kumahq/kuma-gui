import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake, pager }: EndpointDependencies): MockResponder => (req) => {
  const query = req.url.searchParams
  const _gateway = query.get('gateway') ?? ''
  const _name = query.get('name') ?? ''
  const _tags = query.get('tag') ?? ''

  const { offset, total, next, pageTotal } = pager(
    env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/dataplanes',
  )

  const inbounds = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  const tags = _tags !== ''
    ? Object.fromEntries([_tags]
      .filter((tag) => Boolean(tag))
      .map(item => { const [key, ...rest] = item.split(':'); return [key, rest.join(':')] }))
    : {}

  let filterType: 'gateway_builtin' | 'gateway_delegated' | 'proxy' | undefined
  if (_gateway === 'builtin' || _gateway === 'delegated') {
    filterType = `gateway_${_gateway}`
  } else if (_gateway === 'false') {
    filterType = 'proxy'
  } else if (tags['kuma.io/service']) {
    if (tags['kuma.io/service'].includes('gateway_builtin')) {
      filterType = 'gateway_builtin'
    } else if (tags['kuma.io/service'].includes('gateway_delegated')) {
      filterType = 'gateway_delegated'
    } else {
      filterType = 'proxy'
    }
  }

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i

        const isMultizone = true && fake.datatype.boolean()

        const type = filterType ?? fake.helpers.arrayElement(['gateway_builtin', 'gateway_delegated', 'proxy'])
        const mesh = `${fake.hacker.noun()}-${id}`
        const name = `${_name || fake.kuma.dataPlaneProxyName()}-${type}-${id}`
        const service = tags['kuma.io/service']

        return {
          type: 'Dataplane',
          mesh,
          name,
          networking: fake.kuma.dataplaneNetworking({ type, inbounds, isMultizone, service }),
        }
      }),
    },
  }
}
