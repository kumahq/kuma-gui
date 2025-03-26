import { describe, expect, test as _test } from 'vitest'

import { HostnameGenerator } from './HostnameGenerator'
import { plugin, server } from '@/test-support/data'
import mock from '@/test-support/mocks/src/hostname-generators/_/_overview'

describe('HostnameGenerator', () => {
  const test = _test.extend(plugin<typeof HostnameGenerator>(
    HostnameGenerator,
    server(mock, {
      params: {
        name: 'local-mesh-external-service',
      },
    }),
  ))

  describe('hostnameGenerator.$raw', () => {
    test('$raw is the same as original API response', async ({ fixture }) => {
      let expected
      const actual = await fixture.setup((item) => {
        expected = item
        return item
      })
      expect(actual.$raw).toStrictEqual(expected)
    })
  })

  describe('hostnameGenerator.id', () => {
    test('id is hostnameGenerator.name', async ({ fixture }) => {
      let expected
      const actual = await fixture.setup((item) => {
        expected = item.name
        return item
      })
      expect(actual.id).toStrictEqual(expected)
    })
  })

  describe('hostnameGenerator.name', () => {
    test('name is hostnameGenerator.label.display-name', async ({ fixture }) => {
      const response = await fixture.setup((item) => {
        Object.assign(item, { labels: { 'kuma.io/display-name': 'foo' } })
        return item
      })
      expect(response.name).toStrictEqual(response.labels?.['kuma.io/display-name'])
    })
    test('name has a fallback to name', async ({ fixture }) => {
      const response = await fixture.setup((item) => {
        delete item.labels?.['kuma.io/display-name']
        return item
      })
      expect(response.name).toStrictEqual(response.name)
    })
  })

  describe('hostnameGenerator.namespace', () => {
    test('namespace is set from labels', async ({ fixture }) => {
      const ns = 'foo'
      const response = await fixture.setup((item) => {
        Object.assign(item, { labels: { 'k8s.kuma.io/namespace': ns } })
        return item
      })
      expect(response.namespace).toStrictEqual(ns)
    })
  })

  describe('hostnameGenerator.zone', () => {
    test('zone is set from labels when origin is zone', async ({ fixture }) => {
      const zone = 'foo'
      const response = await fixture.setup((item) => {
        Object.assign(item, {
          labels: {
            'kuma.io/origin': 'zone',
            'kuma.io/zone': zone,
          },
        })
        return item
      })
      expect(response.zone).toStrictEqual(zone)
    })
  })
})
