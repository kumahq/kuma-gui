import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const { total, next, pageTotal } = pager(
    env('KUMA_MESH_COUNT', `${fake.number.int({ min: 1, max: 200 })}`),
    req,
    '/meshes',
  )
  return {
    headers: {
    },
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const name = i === 0 ? 'default' : `${fake.word.noun()}-${i}`

        return {
          name,
          type: 'Mesh',
          creationTime: '2020-06-19T12:18:02.097986-04:00',
          modificationTime: '2020-06-19T12:18:02.097986-04:00',
          kri: fake.kuma.kri({ resourceName: 'Mesh', zone: '', mesh: '', namespace: '', name, sectionName: '' }),
        }
      }),
      next,
    },
  }
}
