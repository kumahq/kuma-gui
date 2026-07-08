<template>
  <slot name="default" />
</template>
<script lang="ts">
 
import SharedPool from '../../utilities/SharedPool'
import type { Router } from 'vue-router'

const findAnchor = (target: HTMLElement) => {
  // we look for anchors, or any other element that has [data-actionable]
  const $el = target.tagName.toLowerCase() === 'a' ? target : target.closest('a,[data-actionable]')
  if($el) {
    switch(true) {
      // if its a data-action element we "bubble down" to find a child [data-action]
      case $el.hasAttribute('data-actionable'):
        return $el.querySelector('[data-action]')
      default:
        return $el
    }
  }
  // anything else we do nothing special
  return null
}
const createListener = (router: Router) => {
  return (e: PointerEvent) => {
    // event guards: special click whilst key pressed plus defaultPrevented
    if(
      [
        e.metaKey,
        e.ctrlKey,
        e.shiftKey,
        e.altKey,
        e.defaultPrevented,
      ].some(item => item)
    ) {
      return
    }
    const $a = findAnchor(e.target as HTMLElement)
    if($a) {
      const href = $a.getAttribute('href') ?? ''
      // anchor guards: special attributes plus external sites
      if(
        [
          href === '',
          $a.hasAttribute('download'),
          ($a.getAttribute('target') ?? '') === '_blank',
          ($a.getAttribute('rel') ?? '').includes('external'),
          ((url) => url.origin !== location.origin || url.hash && url.pathname === location.pathname)(new URL(href, document.baseURI)),
        ].some(item => item)
      ) {
        return
      }

      if(href.length > 0) {
        e.preventDefault()
        const base = router.options.history.base
        router.push(href.startsWith(base) ? href.substring(base.length) : href)
      }
    }
  }
}

type Key = {
  router: Router
  element: HTMLElement
}
const pool = new SharedPool<Key, (e: PointerEvent) => void>((state, key, item) => {
  switch (state) {
    case 'creating': {
      const listener = createListener(key.router)
      key.element.addEventListener('click', listener)
      return listener
    }
    case 'acquiring':
      return item
    case 'releasing':
      return item
    case 'destroying':
      key.element.removeEventListener('click', item)
      return item
  }
})

const keys = new WeakMap<HTMLElement, Key>()
</script>
<script lang="ts" setup>
// eslint-disable-next-line import/order
import { onMounted, onBeforeUnmount } from 'vue'
// eslint-disable-next-line import/order
import { useRouterElement } from '../../index'
// eslint-disable-next-line import/order
import { useRouter } from 'vue-router'

const router = useRouter()

// keep a track of unique element => router/element pairs
const key = () => {
  const element = useRouterElement()
  const key = keys.get(element) ?? {
    router,
    element,
  }
  keys.set(element, key)
  return key
}
const sym = Symbol('x-router')
onMounted(() => {
  pool.acquire(key(), sym)
})
onBeforeUnmount(() => {
  pool.release(key(), sym)
})
</script>
