import { describe, expect, test } from 'vitest'

import { Kri, ContextualKri } from './kri'

describe('kri', () => {
  test.each([
    // Kri
    [
      Kri.fromString('kri_policy_mesh_zone_namespace_name_section'),
      {
        shortName: 'policy',
        mesh: 'mesh',
        zone: 'zone',
        namespace: 'namespace',
        name: 'name',
        sectionName: 'section',
      },
    ],
    [
      Kri.fromString('kri_policy__zone__name_section'),
      {
        shortName: 'policy',
        mesh: '',
        zone: 'zone',
        namespace: '',
        name: 'name',
        sectionName: 'section',
      },
    ],
    [
      Kri.toString({
        shortName: 'policy',
        mesh: 'mesh',
        zone: 'zone',
        namespace: 'namespace',
        name: 'name',
        sectionName: 'section',
      }),
      'kri_policy_mesh_zone_namespace_name_section',
    ],
    [
      Kri.toString({
        shortName: 'policy',
        zone: 'zone',
        name: 'name',
        sectionName: 'section',
      }),
      'kri_policy__zone__name_section',
    ],

    // ContextualKri
    [
      ContextualKri.fromString('self_inbound_httpport'),
      {
        context: 'inbound',
        sectionName: 'httpport',
      },
    ],
    [
      ContextualKri.fromString('self_transparentproxy_passthrough_inbound_ipv4'),
      {
        context: 'transparentproxy_passthrough_inbound',
        sectionName: 'ipv4',
      },
    ],
    [
      ContextualKri.toString({
        context: 'inbound',
        sectionName: '8080',
      }),
      'self_inbound_8080',
    ],
    [
      ContextualKri.toString({
        context: 'transparentproxy_passthrough_inbound',
        sectionName: 'ipv6',
      }),
      'self_transparentproxy_passthrough_inbound_ipv6',
    ],
  ])('Kri methods produce expected output', (input, output) => {
    expect(input).toEqual(output)
  })
})
