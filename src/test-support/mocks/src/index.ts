import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {
    },
    body: {
      hostname: 'control-plane-5d94cb99c6-rzr96',
      tagline: 'kuma',
      version: '1.7.1',
      basedOnKuma: '1.7.1',
      instanceId: 'control-plane-5d94cb99c6-rzr96-ca19',
      clusterId: 'b3c42481-0681-4da7-a276-c1fd4ed3c7a1',
      gui: 'The gui is available at /gui',
    },
  }
}
