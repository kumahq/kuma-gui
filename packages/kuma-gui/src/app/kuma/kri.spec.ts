import { describe, expect, test } from 'vitest'

import { Kri } from './kri'

describe('kri', () => {
  test.each([
    // Kri
    [
      Kri.fromString('kri_policy_mesh_zone_namespace_name_section'),
      {
        id: 'name.namespace',
        kind: 'policy',
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
        id: 'name',
        kind: 'policy',
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
        id: '',
        kind: '',
        mesh: '',
        zone: '',
        namespace: '',
        name: '',
        sectionName: '',
      },
    ],
    [
      Kri.fromString('not-kri_foo_bar_baz_qux_quux_corge'),
      {
        id: '',
        kind: '',
        mesh: '',
        zone: '',
        namespace: '',
        name: '',
        sectionName: '',
      },
    ],
    [
      Kri.toString({
        kind: 'policy',
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
        kind: 'policy',
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
