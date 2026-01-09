export function get(obj: any, path: string, defaultValue: any = undefined): any {
  if (!(typeof obj === 'object') || Array.isArray(obj)) {
    return defaultValue
  }

  const props = path.split('.')
  if (props.length === 1) {
    const value = obj[props[0]]
    return typeof value === 'undefined' ? defaultValue : value
  }

  return get(obj[props[0]], props.slice(1).join('.'), defaultValue)
}

/**
 * Schedules a function to run before the next browser paint using
 * requestAnimationFrame. Automatically cancels any previously scheduled
 * invocation, making it safe to call repeatedly without stacking up
 * multiple scheduled callbacks.
 *
 * @param fn - The function to schedule before the next paint
 * @returns A debounced function that schedules `fn` to run before the next frame
 *
 * @example
 * const setTitle = beforePaint((title) => {
 *   document.title = title
 * })
 * setTitle('Loading...') // schedules for next frame
 * setTitle('Complete')   // cancels previous, schedules this instead
 */
export const beforePaint = <T extends (...args: any[]) => void>(fn: T) => {
  let num: number
  return (...args: Parameters<T>) => {
    if (num) {
      window.cancelAnimationFrame(num)
    }
    num = window.requestAnimationFrame(fn.bind(fn, ...args))
  }
}

/**
 * Creates a debounced title setter that schedules document.title updates
 * before the next browser paint.
 *
 * @param $doc - The document object to update (defaults to global document)
 * @returns A function that sets the document title before the next paint
 */
export const createTitleSetter = ($doc = document) => {
  return beforePaint((title) => {
    $doc.title = title
  })
}

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => arr.includes(item as T[number])
const supportedAttrs = ['class'] as const
type SupportedAttrs = typeof supportedAttrs[number]
/**
 * Creates an attributes setter that applies attributes to a HTML element
 * before the next browser paint. Preserves existing attributes, i.e. any
 * existing classes not added via this function will be preserved/unmodified.
 *
 * Mostly used for reactively amending attributes on the root node from within
 * a subnode application.
 *
 * **Warning** Currently only supports setting `class`
 *
 * @param $el - The element to apply attributes to (defaults to document.documentElement)
 * @returns A function that accepts an array of attribute objects and applies them before the next paint.
 *          Returns a no-op function if the element doesn't exist.
 *
 * @example
 * const setAttrs = createAttrsSetter(document.documentElement)
 * setAttrs([{ class: 'dark-mode' }, { class: 'sidebar-open' }])
 * // Adds 'dark-mode' and 'sidebar-open' classes before next paint
 */
export const createAttrsSetter = ($el = document.documentElement) => {
  if (!$el) {
    return () => { }
  }

  // "exisiting" originalClasses that are preserved are the attrs that exists
  // at the point of calling this function, generally this is at the very start
  // of the app
  const originalClasses = new Set($el.classList)

  return beforePaint((attrs: Partial<Record<SupportedAttrs, string>>[]) => {
    // flat ends up being `{ class: Set {'dark-mode', 'sidebar-open'} }`
    const flat = attrs.reduce<Record<SupportedAttrs, Set<string>>>((prev, item) => {
      return Object.entries(item).reduce(
        (prev, [key, value]) => {
          if (includes(supportedAttrs, key) && value) {
            prev[key].add(value)
          }
          return prev
        }, prev,
      )
    }, { class: new Set() })

    const currentClasses = new Set($el.classList).difference(originalClasses)
    $el.classList.remove(...currentClasses.difference(flat.class))
    $el.classList.add(...flat.class.difference(currentClasses))
  })
}
