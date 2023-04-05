import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      total: 2,
      items: [
        {
          dataplane: {
            mesh: 'default',
            name: 'backend',
          },
          attachments: [
            {
              type: 'inbound',
              name: '192.168.0.1:80:81',
            },
          ],
        },
        {
          dataplane: {
            mesh: 'default',
            name: 'db',
          },
          attachments: [
            {
              type: 'inbound',
              name: '192.168.0.1:80:81',
            },
          ],
        },
        {
          dataplane: {
            mesh: 'default',
            name: 'frontend',
          },
          attachments: [
            {
              type: 'inbound',
              name: '192.168.0.1:80:81',
            },
          ],
        },
      ],
      next: null,
    },
  }
}
