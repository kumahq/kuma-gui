import type { EndpointDependencies, MockResponder } from '@/test-support'

export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJab25lIjoid2VzdCIsIlNjb3BlIjpbImNwIl0sImV4cCI6MTY2OTU0NjkzOSwibmJmIjoxNjY2OTU0NjM5LCJpYXQiOjE2NjY5NTQ5MzksImp0aSI6IjZiYWYyYzkwLTBlODYtNGM2Mi05N2E3LTc4MzU4NTU4MzRiYyJ9.DJfA0M6uUfO4oytp8jHtzngiVggQWQR88YQxWVU1ujc0Zv-XStRDwvpdEoFGOzWVn4EUfI3gcv9qS2MxqIzQjJ83k5Jq85w4hkPyLGr-0jNS1UZF6yXz7lB_As8f91gMVHbRAoFuoybV5ndDtfYzwZknyzott7doxk-SjTes2GDvpg0-kFNGc4MBR2EprGl7YKO0vhFxQjln5AyCAhmAA7-PM7WRCzhmS-pUXacfZtP2VulWYhmTAuLPnkJrJN-ZWPkIpnV1MZmsgWbzTpnW-PhmCMQfD5m2im1c_3OlFwa9P9rZQQhdhbTp0ofMvW-cdCAcG_lOJI5j60cqPh2DGg',
    },
  }
}
