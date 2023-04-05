import type { MockResponder } from '@/test-support/fake'
export default (): MockResponder => (_req) => {
  return {
    headers: {
      'Status-Code': '403',
    },
    body: {
      code: 'access_denied',
      title: 'Permission denied',
      details: 'You currently don’t have access to this data.',
      causes: [
        {
          field: 'id',
          message: 'This field is required.',
        },
      ],
    },
  }
}
