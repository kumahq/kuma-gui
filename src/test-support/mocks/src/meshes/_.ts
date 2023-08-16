import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const name = req.params.mesh

  return {
    headers: {},
    body: {
      name,
      type: 'Mesh',
      creationTime: '2020-06-19T12:18:02.097986-04:00',
      modificationTime: '2020-06-19T12:18:02.097986-04:00',
      ...(fake.datatype.boolean() && {
        mtls: {
          enabledBackend: 'ca-1',
          backends: [
            {
              name: 'ca-1',
              type: 'provided',
              dpCert: {
                rotation: {
                  expiration: '1d',
                },
              },
              conf: {
                cert: {
                  secret: 'name-of-secret',
                },
                key: {
                  secret: 'name-of-secret',
                },
              },
            },
            {
              name: 'ca-2',
              type: 'BUILTIN',
            },
          ],
        },
      }),
      ...(fake.datatype.boolean() && {
        logging: {
          backends: [
            {
              name: 'logstash',
              type: 'tcp',
              conf: {
                address: '127.0.0.1:5000',
              },
            },
            {
              name: 'file',
              type: 'file',
              conf: {
                path: '/tmp/service.log',
              },
            },
          ],
        },
      }),
      ...(fake.datatype.boolean() && {
        metrics: {
          enabledBackend: 'prometheus-1',
          backends: [
            {
              name: 'prometheus-1',
              type: 'prometheus',
              conf: {
                path: '/non-standard-path',
                port: 1234,
              },
            },
            {
              name: 'prometheus-2',
              type: 'prometheus',
              conf: {
                path: '/non-standard-path',
                port: 1235,
              },
            },
          ],
        },
      }),
      ...(fake.datatype.boolean() && {
        tracing: {
          backends: [
            {
              name: 'zipkin-us',
              type: 'zipkin',
              conf: {
                url: 'http://zipkin.us:8080/v1/spans',
              },
            },
            {
              name: 'zipkin-eu',
              type: 'zipkin',
              conf: {
                url: 'http://zipkin.eu:8080/v1/spans',
              },
            },
          ],
        },
      }),
    },
  }
}
