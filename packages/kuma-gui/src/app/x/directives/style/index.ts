import type { Directive } from 'vue'

type DirectiveValue = Record<string, boolean> | string
type DirectiveModifiers = Partial<Record<'next', boolean | undefined>>
const getDeclarations = (spec: DirectiveValue): string[] => {
  // allow string or { 'prop: value' : boolean }
  return Object.entries(typeof spec === 'string' ? { [spec]: true } : spec)
    // only truthy values
    .filter(([_, value]) => value)
    // allow several declarations in one key
    .map(([key, _]) => key.split(';'))
    // flatten everything to string[]
    .flat()
    // trim and remove any ''s
    .map(item => item.trim()).filter(Boolean)
}
const setDeclaration = ($el: HTMLElement, item: string) => {
  const [property, value] = item.split(':')
  const important = value.includes('!important')
  $el.style.setProperty(property.trim(), important ? value.replace('!important', '').trim() : value.trim(), important ? 'important' : '') // priority
}
const removeDeclaration = ($el: HTMLElement, item: string) => {
  const [property] = item.split(':')
  $el.style.removeProperty(property.trim())
}
export default (map = new WeakMap<HTMLElement, Set<string>>()) => {
  const created = ($el: HTMLElement, { value, modifiers: _ }: { value: DirectiveValue, modifiers: DirectiveModifiers }) => {
    const declarations = getDeclarations(value)
    map.set($el, new Set(declarations))
    declarations.forEach(item => setDeclaration($el, item))
  }
  const updated = ($el: HTMLElement, { value, modifiers: _ }: { value: DirectiveValue, modifiers: DirectiveModifiers }) => {
    const previous = map.get($el) ?? new Set()
    const declarations = new Set(getDeclarations(value))
    Array.from(previous.difference(declarations)).forEach(item => removeDeclaration($el, item))
    Array.from(declarations.difference(previous)).forEach(item => setDeclaration($el, item))
    map.set($el, declarations)
  }
  return {
    created: (...args: Parameters<typeof created>) => {
      if (args[1].modifiers.next) {
        setTimeout(() => created(...args), 0)
      } else {
        created(...args)
      }
    },
    beforeUpdate: (...args: Parameters<typeof updated>) => {
      if (args[1].modifiers.next) {
        setTimeout(() => updated(...args), 0)
      } else {
        updated(...args)
      }
    },
    unmounted: ($el: HTMLElement) => {
      map.delete($el)
    },
  } satisfies Directive
}
