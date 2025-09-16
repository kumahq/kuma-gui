import type { Dependencies, ResponseHandler } from '#mocks'
export default (_deps: Dependencies): ResponseHandler => (_req) => {
  return {
    headers: {},
    body: {
      version_info: '0',
      resources: [
        {
          '@type': 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment',
          cluster_name: 'default/snuba-query-tcp',
          endpoints: [
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
            {
              lb_endpoints: [
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.109',
                        port_value: 9000,
                      },
                    },
                  },
                },
                {
                  endpoint: {
                    address: {
                      socket_address: {
                        address: '192.168.208.139',
                        port_value: 9000,
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }
}
