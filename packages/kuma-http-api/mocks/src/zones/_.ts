import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  switch (req.method.toUpperCase()) {
    case 'DELETE':
      return {
        headers: {
          ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
        },
        body: {},
      }
    default:
      return {
        headers: {
          ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
        },
        body: {
          type: 'Zone',
          name: req.params.name,
          creationTime: '2021-02-19T08:06:15.380674+01:00',
          modificationTime: '2021-02-19T08:06:15.380674+01:00',
          enabled: true,
        },
      }
  }
}
