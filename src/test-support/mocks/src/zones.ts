import type { EndpointDependencies, MockResponder } from '@/test-support'
import { RestRequest } from '@/test-support/fake'

export default (deps: EndpointDependencies): MockResponder => (req) => {
  switch (req.method) {
    case 'POST': {
      return createZone(req, deps)
    }
    case 'GET':
    default: {
      return getZones(req, deps)
    }
  }
}

function getZones(_req: RestRequest, { fake }: EndpointDependencies) {
  const total = fake.datatype.number(10)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.hacker.noun()}-${i}`
        return {
          type: 'Zone',
          name,
          creationTime: '2020-07-22T19:37:28.442793+03:00',
          modificationTime: '2020-07-22T19:37:28.442793+03:00',
          enabled: true,
        }
      }),
      next: null,
    },
  }
}

function createZone(req: RestRequest, _deps: EndpointDependencies) {
  return {
    headers: {},
    body: {
      name: req.body.name,
      creationTime: '2020-07-22T19:37:28.442793+03:00',
      modificationTime: '2020-07-22T19:37:28.442793+03:00',
      enabled: false,
      token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJab25lIjoid2VzdCIsIlNjb3BlIjpbImNwIl0sImV4cCI6MTY2OTU0NjkzOSwibmJmIjoxNjY2OTU0NjM5LCJpYXQiOjE2NjY5NTQ5MzksImp0aSI6IjZiYWYyYzkwLTBlODYtNGM2Mi05N2E3LTc4MzU4NTU4MzRiYyJ9.DJfA0M6uUfO4oytp8jHtzngiVggQWQR88YQxWVU1ujc0Zv-XStRDwvpdEoFGOzWVn4EUfI3gcv9qS2MxqIzQjJ83k5Jq85w4hkPyLGr-0jNS1UZF6yXz7lB_As8f91gMVHbRAoFuoybV5ndDtfYzwZknyzott7doxk-SjTes2GDvpg0-kFNGc4MBR2EprGl7YKO0vhFxQjln5AyCAhmAA7-PM7WRCzhmS-pUXacfZtP2VulWYhmTAuLPnkJrJN-ZWPkIpnV1MZmsgWbzTpnW-PhmCMQfD5m2im1c_3OlFwa9P9rZQQhdhbTp0ofMvW-cdCAcG_lOJI5j60cqPh2DGg',
    },
  }
}
