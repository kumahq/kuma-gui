import type {  MockResponse, RestRequest } from './fake'

export type { FS, EndpointDependencies, MockResponder } from './fake'

export type Merge = (obj: Partial<MockResponse>) => MockResponse
export type Callback = (merge: Merge, req: RestRequest, response: MockResponse) => MockResponse
export type Options = Record<string, string>

export const undefinedSymbol = Symbol('undefined')
