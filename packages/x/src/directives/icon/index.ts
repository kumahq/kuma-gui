import style from '../style'
import type { Directive, DirectiveBinding } from 'vue'
const rule = (position: 'start' | 'end', { name = '', size = '', d = ''}: { name?: string, size?: string, d?: string}) => {
  if(name.length === 0) {
    return ''
  }
  return `--icon-name-${position}: var(--icon-${name}${d ? `,var(--icon-${d})` : ''});${size ? `--icon-size-${position}: icon-size-${size};` : ''}`
}
export default (position: 'start' | 'end', map = new WeakMap<HTMLElement, Set<string>>()) => {
  const vStyle = style(map)
  return {
    created: ($el: HTMLElement, params: DirectiveBinding) => {
      return vStyle.created($el, {
        ...params,
        value: rule(position, typeof params.value === 'string' ? { name: params.value } : { ...params.value ?? {}, d: params.value?.default ?? '' }),
      })
    },
    beforeUpdate: ($el: HTMLElement, params: DirectiveBinding) => {
      return vStyle.beforeUpdate($el, {
        ...params,
        value: rule(position, typeof params.value === 'string' ? { name: params.value } : { ...params.value ?? {}, d: params.value?.default ?? '' }),
      })
    },
    unmounted: ($el: HTMLElement) => {
      return vStyle.unmounted($el)
    },
  } satisfies Directive
}
