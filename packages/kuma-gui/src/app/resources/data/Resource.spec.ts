import { describe, expect, test } from 'vitest'

import { Resource } from './Resource'

describe('Resource.search', () => {
  test.each([
    // Name
    [
      'foo',
      {
        name: 'foo',
      },
    ],
    [
      'name',
      {
        name: 'name',
      },
    ],
    [
      'name:foo',
      {
        name: 'foo',
      },
    ],

    // Shortcuts
    [
      'namespace:foo',
      {
        ['filter[labels.k8s.kuma.io/namespace]']: 'foo',
      },
    ],
    [
      'zone:foo',
      {
        ['filter[labels.kuma.io/zone]']: 'foo',
      },
    ],
    [
      'service:foo',
      {
        ['filter[labels.kuma.io/service]']: 'foo',
      },
    ],
    [
      'namespace:foo service:bar zone:baz',
      {
        ['filter[labels.k8s.kuma.io/namespace]']: 'foo',
        ['filter[labels.kuma.io/service]']: 'bar',
        ['filter[labels.kuma.io/zone]']: 'baz',
      },
    ],
    [
      'tag:namespace:foo tag:zone:bar tag:kuma.io/service:baz',
      {
        tag: ['k8s.kuma.io/namespace:foo', 'kuma.io/zone:bar', 'kuma.io/service:baz'],
      },
    ],
    [
      'label:namespace:foo label:zone:bar label:kuma.io/service:baz',
      {
        ['filter[labels.k8s.kuma.io/namespace]']: 'foo',
        ['filter[labels.kuma.io/zone]']: 'bar',
        ['filter[labels.kuma.io/service]']: 'baz',
      },
    ],
    [
      'label:namespace:foo tag:zone:bar',
      {
        ['filter[labels.k8s.kuma.io/namespace]']: 'foo',
        tag: ['kuma.io/zone:bar'],
      },
    ],

    // Labels
    [
      'foo:bar',
      {
        ['filter[labels.foo]']: 'bar',
      },
    ],
    [
      'label:foo:bar',
      {
        ['filter[labels.foo]']: 'bar',
      },
    ],
    [
      'label: foo:bar',
      {
        ['filter[labels.foo]']: 'bar',
      },
    ],
    [
      'label:foo:bar label:baz=qux label: quux:quuux label: kuma.io/service=foo',
      {
        ['filter[labels.foo]']: 'bar',
        ['filter[labels.baz]']: 'qux',
        ['filter[labels.quux]']: 'quuux',
        ['filter[labels.kuma.io/service]']: 'foo',
      },
    ],

    // Invalids
    [
      ':',
      {},
    ],
    [
      'foo:',
      {},
    ],
    [
      ':foo',
      {},
    ],
  ])('searching by %s works', (search, expected) => {
    const actual = Resource.search(search)
    expect(actual).toStrictEqual(expected)
  })

  // defaultKey
  test.each([
    [
      'bar',
      'foo',
      {
        foo: 'bar',
      },
    ],
    [
      'foo',
      'bar',
      {
        bar: 'foo',
      },
    ],
  ])('using %s as the defaultKey works', (search, defaultKey, expected) => {
    const actual = Resource.search(search, { defaultKey })
    expect(actual).toStrictEqual(expected)
  })

})
