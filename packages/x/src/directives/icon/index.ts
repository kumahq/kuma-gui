import style from '../style'
import type { Directive, DirectiveBinding } from 'vue'

export default (position: 'start' | 'end', map = new WeakMap<HTMLElement, Set<string>>()) => {
  const vStyle = style(map)
  return {
    created: ($el: HTMLElement, params: DirectiveBinding) => {
      return vStyle.created($el, {
        ...params,
        value: `--icon-name-${position}: var(--icon-${params.value})`,
      })
    },
    beforeUpdate: ($el: HTMLElement, params: DirectiveBinding) => {
      return vStyle.beforeUpdate($el, {
        ...params,
        value: `--icon-name-${position}: var(--icon-${params.value})`,
      })
    },
    unmounted: ($el: HTMLElement) => {
      return vStyle.unmounted($el)
    },
  } satisfies Directive
}
