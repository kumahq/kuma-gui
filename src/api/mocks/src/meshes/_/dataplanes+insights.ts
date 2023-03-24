/* eslint-disable quote-props */
/* eslint-disable object-shorthand */
import all from '@/api/mock-data/meshes/default/dataplanes+insights.json'
import gateways from '@/api/mock-data/meshes/default/dataplanes+insights__gateways-all.json'
import builtin from '@/api/mock-data/meshes/default/dataplanes+insights__gateways-builtin.json'
import delegated from '@/api/mock-data/meshes/default/dataplanes+insights__gateways-delegated.json'
import type { MockResponder } from '@/api/mocks/index'

export default (): MockResponder => (req) => {
  const gateway = req.url.searchParams.get('gateway') ?? ''
  const proxies = all
  proxies.items = proxies.items.filter((item: any) => item.dataplane.networking.gateway === undefined)
  proxies.total = proxies.items.length
  const body: Record<string, Record<string, unknown>> = {
    'true': gateways,
    'builtin': builtin,
    'delegated': delegated,
    'false': proxies,
    '': all,
  }
  return {
    headers: {},
    body: body[gateway],
  }
}
