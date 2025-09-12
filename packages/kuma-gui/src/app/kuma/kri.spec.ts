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
