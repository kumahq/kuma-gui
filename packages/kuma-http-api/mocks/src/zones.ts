import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_ZONE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/zones',
  )

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.word.noun()}-${id}`
        return {
          type: 'Zone',
          name,
          kri: fake.kuma.kri({ resourceName: 'Zone', zone: '', mesh: '', namespace: '', name, sectionName: '' }),
          ...fake.kuma.timespan(),
          enabled: true,
        }
      }),
      next,
    },
  }
}
