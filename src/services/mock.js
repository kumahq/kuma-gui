export default class Mock {
  constructor (axios) {
    var MockAdapter = require('axios-mock-adapter')

    this.mock = new MockAdapter(axios, { delayResponse: 1000 })
    this.mock.injectMocks = () => { return this.mock }
  }

  setupPluginMocks () {
    this.mock
      .injectMocks() // additional mocks added from RestClient
      .onAny().passThrough()
  }

  setupMockEndpoints () {
    console.warn('%c ✨You are mocking api requests.',
      'background: gray; color: white; display: block; padding: 0.25rem;')

    this.mock
      .onGet('/default/groups').reply(200, {
        total: 1,
        data: [
          {
            created_at: 1566421282,
            id: '83bc4d30-1ced-4df3-b87e-84e648a8071b',
            comment: 'cool group name',
            name: 'cool mapping'
          },
          {
            created_at: 1566421282,
            id: '83bc4d30-1ced-4df3-b87e-84e648a8071c',
            comment: 'cool group name1',
            name: 'cool mapping1'
          },
          {
            created_at: 1566421282,
            id: '83bc4d30-1ced-4df3-b87e-84e648a8071d',
            comment: 'cool group name2',
            name: 'cool mapping2'
          },
          {
            created_at: 1566421282,
            id: '83bc4d30-1ced-4df3-b87e-84e648a8071e',
            comment: 'cool group name3',
            name: 'cool mapping3'
          },
          {
            created_at: 1566421282,
            id: '83bc4d30-1ced-4df3-b87e-84e648a8071f',
            comment: 'cool group name4',
            name: 'cool mapping4'
          },
          {
            created_at: 1566421282,
            id: '83bc4d30-1ced-4df3-b87e-84e648a8071g',
            comment: 'cool group name5',
            name: 'cool mapping5'
          },
          {
            created_at: 1566421282,
            id: '83bc4d30-1ced-4df3-b87e-84e648a8071g',
            comment: 'cool group name6',
            name: 'cool mapping6'
          }
        ],
        offset: 'WyJmOTFhYTc4My1hYTY1LTQ5YTItOGYzZC1kZmM1ZDIxMDIxYzIiXQ'
      })
      .onAny().passThrough()
  }
}
