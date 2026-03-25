import Kongponents from '@kong/kongponents'
import { token } from '@kumahq/container'
import X from '@kumahq/x'
import { useLink } from 'vue-router'

import { services as controlPlanes } from '@/app/control-planes'
import { services as hostnameGenerators } from '@/app/hostname-generators'
import { Kri } from '@/app/kuma'
import { services as me } from '@/app/me'
import { services as meshes } from '@/app/meshes'
import { services as zones } from '@/app/zones'
import type { ServiceDefinition, Token } from '@kumahq/container'
import type { Router } from 'vue-router'

const findAnchor = (target: HTMLElement) => {
  // we look for anchors, or any other element that has [data-actionable]
  const $el = target.tagName.toLowerCase() === 'a' ? target : target.closest('a,[data-actionable]')
  if($el) {
    switch(true) {
      // if its a data-action element we "bubble down" to find a child [data-action]
      case $el.hasAttribute('data-actionable'):
        return $el.querySelector('[data-action]')
      // otherwise we check for rel="x-internal"
      // which allows us to use vue-router links in our i18n locales files via
      // <a href="http-link" rel="x-internal" />
      // and helps us support custom protocols
      case ($el.getAttribute('rel') ?? '').includes('x-internal'):
        return $el
    }
  }
  // anything else we do nothing special
  return null
}
const protocolHandler = (router: Router, doc = document) => {

  const base = router.options.history.base

  const listener = (e: Event) => {
    // if its not a user generated event return
    // if we ever need this listener to also fire on non-user generated events
    // we'll have to refine findAnchor and remove this
    if(!e.isTrusted) {
      return
    }
    const $a = findAnchor(e.target as HTMLElement)
    if($a) {
      // anything with x-internal is something for whatever reason we can't/don't want to use RouterLink
      if (($a.getAttribute('rel') ?? '').includes('x-internal')) {
        const href = $a.getAttribute('href')
        if(href) {
          e.preventDefault()
          e.stopPropagation()
          router.push(href.startsWith(base) ? href.substring(base.length) : href)
        }
      // anything else
      } else if('click' in $a && typeof $a.click === 'function') {
        $a.click()
      }
    }
  }
  // install
  doc.body.addEventListener('click', listener)

  return (href: string) => {
    const url = new URL(href)
    if(!Kri.isKriString(url.hostname)) {
      return href
    }
    const { shortName, mesh, namespace, zone, name } = Kri.fromString(url.hostname)
    const id = `${name}${namespace !== '' ? `.${namespace}`: '' }`
    const relative = url.searchParams.get('relative')
    if(relative !== null) {
      const urlPath = router.resolve({ ...router.currentRoute.value.matched.find((m) => m.name === relative), params: router.currentRoute.value.params }).path
      const matched = router.resolve([
        urlPath,
        url.hostname,
      ].join('/'))

      if(!matched.path) {
        return href
      }

      return {
        path: matched.path,
      }
    }

    const to = (() => {
      const policyPath = url.searchParams.get('policyPath')
      switch(true) {
        case policyPath !== null:
          return {
            name: 'policy-detail-view',
            params: {
              mesh,
              policy: id,
              policyPath,
              resourcePath: policyPath,
            },
          }
        case shortName === 'mgw':
          return {
            name: 'builtin-gateway-detail-view',
            params: {
              mesh,
              gateway: id,
            },
          }
        case shortName === 'wl':
          return {
            name: 'workload-detail-view',
            params: {
              mesh,
              wl: url.hostname,
            },
          }
        case shortName === 'hg':
          return {
            name: 'hostname-generator-detail-view',
            params: {
              mesh,
              name: id,
            },
          }
        case shortName === 'm':
          return {
            name: 'mesh-detail-view',
            params: {
              name: mesh,
            },
          }
        case shortName === '$zone': {
          return {
            name: 'zone-cp-detail-view',
            params: {
              zone,
            },
          }
        }
        // case shortName === 'ze': {
        //   return {
        //     name: 'zone-egress-detail-view',
        //     params: {
        //       zone,
        //       proxy: id,
        //     },
        //   }
        // }
        // case shortName === 'zi': {
        //   return {
        //     name: 'zone-ingress-detail-view',
        //     params: {
        //       zone,
        //       proxy: id,
        //       proxyType: 'ingresses',
        //     },
        //   }
        // }
        // case shortName === 'dp':
        //   return {
        //     name: 'data-plane-detail-view',
        //     params: {
        //       mesh,
        //       proxy: id,
        //     },
        //   }
        // case shortName === 'msvc':
        //   return {
        //     name: 'mesh-service-detail-view',
        //     params: {
        //       mesh,
        //       service: id,
        //     },
        //   }
        // case shortName === 'mzsvc':
        //   return {
        //     name: 'mesh-multi-zone-service-detail-view',
        //     params: {
        //       mesh: mesh,
        //       service: id,
        //     },
        //   }
        // case shortName === 'extsvc':
        //   return {
        //     name: 'mesh-external-service-detail-view',
        //     params: {
        //       mesh: mesh,
        //       service: id,
        //     },
        //   }
        default: {
          return {
            name: 'resource-detail-view',
            params: {
              kri: url.hostname,
            },
          }
        }
      }
    })()

    if(to) {
      const link = useLink({ to })
      return link.href.value
    }
    return href
  }
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    ...me(app),
    [token('service-mesh.plugins'), {
      service: (i18n, router) => {
        return [
          [Kongponents],
          [X, {
            i18n,
            protocolHandler: protocolHandler(router),
          }],
        ]
      },
      arguments: [
        app.i18n,
        app.router,
      ],
      labels: [
        app.plugins,
      ],
    }],
    //
    ...controlPlanes(app),
    ...zones(app),
    ...meshes(app),
    ...hostnameGenerators(app),
  ]
}
