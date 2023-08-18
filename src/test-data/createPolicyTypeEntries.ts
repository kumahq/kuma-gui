import { PolicyTypeEntry } from '@/types/index'

export function createPolicyTypeEntries(): PolicyTypeEntry[] {
  return [
    {
      type: 'MeshAccessLog',
      connections: [
        {
          sourceTags: [],
          destinationTags: [
            {
              label: 'kuma.io/service',
              value: 'redis',
            },
          ],
          name: '192.168.0.2:8080',
          config: 'backends: \n  - file: \n      path: /tmp/access.logs',
          origins: [
            {
              name: 'mal-1',
              route: {
                name: 'policy-detail-view',
                params: {
                  mesh: 'default',
                  policyType: 'MeshAccessLog',
                  policy: 'mal-1',
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'MeshTrace',
      connections: [
        {
          sourceTags: [],
          destinationTags: [],
          name: null,
          config: "backends: \n  - zipkin: \n      url: 'http://zipkin.internal/api/v2/spans'\ntags: null",
          origins: [
            {
              name: 'mal-1',
              route: {
                name: 'policy-detail-view',
                params: {
                  mesh: 'default',
                  policyType: 'MeshTrace',
                  policy: 'mal-1',
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'MeshTrafficPermission',
      connections: [
        {
          sourceTags: [
            {
              label: 'kuma.io/service',
              value: 'client',
            },
            {
              label: 'kuma.io/zone',
              value: 'east',
            },
          ],
          destinationTags: [
            {
              label: 'kuma.io/service',
              value: 'backend',
            },
          ],
          name: '192.168.0.1:80',
          config: 'action: DENY',
          origins: [
            {
              name: 'mtp-1',
              route: {
                name: 'policy-detail-view',
                params: {
                  mesh: 'default',
                  policyType: 'MeshTrafficPermission',
                  policy: 'mtp-1',
                },
              },
            },
          ],
        },
        {
          sourceTags: [
            {
              label: 'kuma.io/service',
              value: '*',
            },
          ],
          destinationTags: [
            {
              label: 'kuma.io/service',
              value: 'backend',
            },
          ],
          name: '192.168.0.1:80',
          config: 'action: DENY',
          origins: [
            {
              name: 'default',
              route: {
                name: 'policy-detail-view',
                params: {
                  mesh: 'default',
                  policyType: 'MeshTrafficPermission',
                  policy: 'default',
                },
              },
            },
          ],
        },
        {
          sourceTags: [
            {
              label: 'kuma.io/service',
              value: 'client',
            },
            {
              label: 'kuma.io/zone',
              value: 'west',
            },
          ],
          destinationTags: [
            {
              label: 'kuma.io/service',
              value: 'backend',
            },
          ],
          name: '192.168.0.1:80',
          config: 'action: ALLOW',
          origins: [
            {
              name: 'mtp-1',
              route: {
                name: 'policy-detail-view',
                params: {
                  mesh: 'default',
                  policyType: 'MeshTrafficPermission',
                  policy: 'mtp-1',
                },
              },
            },
            {
              name: 'mtp-2',
              route: {
                name: 'policy-detail-view',
                params: {
                  mesh: 'default',
                  policyType: 'MeshTrafficPermission',
                  policy: 'mtp-2',
                },
              },
            },
          ],
        },
      ],
    },
  ]
}
