<template>
  <slot name="default" />
</template>
<script lang="ts">

import { usePush , useRouterElement } from '../../'
import SharedPool from '../../utilities/SharedPool'

type Push = ReturnType<typeof usePush>
type Key = {
  push: Push
  element: HTMLElement
}

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

const createListener = (push: Push) => {
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
        return push(href)
      }
    }
  }
}

const keys = new WeakMap<HTMLElement, Key>()
const pool = new SharedPool<Key, (e: PointerEvent) => void>((state, key, item) => {
  switch (state) {
    case 'creating': {
      const listener = createListener(key.push)
      key.element.addEventListener('click', listener)
      return listener
    }
    case 'acquiring':
      return item
    case 'releasing':
      return item
    case 'destroying':
      keys.delete(key.element)
      key.element.removeEventListener('click', item)
      return item
  }
})

</script>
<script lang="ts" setup>
// eslint-disable-next-line import/order
import { onMounted, onBeforeUnmount } from 'vue'
 

const push = usePush()

// keep a track of unique element => router/element pairs
const key = () => {
  const element = useRouterElement()
  if(element !== null) {
    const key = keys.get(element) ?? {
      push,
      element,
    }
    keys.set(element, key)
    return key
  }
}
const sym = Symbol('x-router')
onMounted(() => {
  const k = key()
  if(k) {
    pool.acquire(k, sym)
  }
})
onBeforeUnmount(() => {
  const k = key()
  if(k) {
    pool.release(k, sym)
  }
})
</script>
