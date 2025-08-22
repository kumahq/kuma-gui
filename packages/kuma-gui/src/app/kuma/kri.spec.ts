import { describe, expect, test } from 'vitest'

import { Kri } from './kri'

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
      Kri.fromString(''),
      {
        shortName: '',
        mesh: '',
        zone: '',
        namespace: '',
        name: '',
        sectionName: '',
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
    [
      Kri.toString({}),
      'kri______',
    ],

    // ContextualKri
    [
      Kri.fromString('self_inbound_httpport'),
      {
        context: 'inbound',
        sectionName: 'httpport',
      },
    ],
    [
      Kri.fromString('self_transparentproxy_passthrough_inbound_ipv4'),
      {
        context: 'transparentproxy_passthrough_inbound',
        sectionName: 'ipv4',
      },
    ],
    [
      Kri.toString({
        context: 'inbound',
        sectionName: '8080',
      }),
      'self_inbound_8080',
    ],
    [
      Kri.toString({
        context: 'transparentproxy_passthrough_inbound',
        sectionName: 'ipv6',
      }),
      'self_transparentproxy_passthrough_inbound_ipv6',
    ],

    // isKri
    [
      Kri.isKriString('kri_policy_mesh_zone_namespace_name_section'),
      true,
    ],
    [
      Kri.isKriString('not_a_kri'),
      false,
    ],
    [
      Kri.isKriString('kri_not_a_kri'),
      false,
    ],
  ])('Kri methods produce expected output', (input, output) => {
    expect(input).toEqual(output)
  })
})
