import Kongponents from '@kong/kongponents'
import { token } from '@kumahq/container'
import X from '@kumahq/x'
import { useLink } from 'vue-router'

import { services as controlPlanes } from '@/app/control-planes'
import { services as hostnameGenerators } from '@/app/hostname-generators'
import { Kri } from '@/app/kuma'
import { services as me } from '@/app/me'
import { services as meshes } from '@/app/meshes'
import { services as resources } from '@/app/resources'
import { services as zones } from '@/app/zones'
import type { ServiceDefinition, Token } from '@kumahq/container'
import type { Router } from 'vue-router'

const findAnchor = (target: HTMLElement) => {
  const $el = target.tagName.toLowerCase() === 'a' ? target : target.closest('a,[data-actionable]')
  if($el) {
    switch(true) {
      case $el.hasAttribute('data-actionable'):
        return $el.querySelector('[data-action]')
      case ($el.getAttribute('rel') ?? '').includes('x-internal'):
        return $el
    }
  }
  return null
}
const protocolHandler = (router: Router, doc = document) => {

  const base = router.options.history.base

  const listener = (e: Event) => {
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
    const kriProto = 'kri://'
    switch (true) {
      case href.startsWith(kriProto): {
        const kri = Kri.fromString(href.substring(kriProto.length))

        const to = ((kri) => {
          switch (true) {
            case kri.kind === 'msvc':
              return {
                name: 'mesh-service-detail-view',
                params: {
                  mesh: kri.mesh,
                  service: kri.id,
                },
              }
            case kri.kind === 'mzsvc':
              return {
                name: 'mesh-multi-zone-service-detail-view',
                params: {
                  mesh: kri.mesh,
                  service: kri.id,
                },
              }
            case kri.kind === 'extsvc':
              return {
                name: 'mesh-external-service-detail-view',
                params: {
                  mesh: kri.mesh,
                  service: kri.id,
                },
              }
            default:
              return
          }
        })(kri)

        if (to) {
          const link = useLink({ to })
          return link.href.value
        }
        return ''
      }
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
    ...resources(app),
  ]
}
