const beforePaint = function (fn: (...args: any[]) => void) {
  let num: number
  return (...args: unknown[]) => {
    if (num) {
      window.cancelAnimationFrame(num)
    }
    num = window.requestAnimationFrame(fn.bind(fn, ...args))
  }
}
export const urlParam = function <T extends string | null> (param: T | T[]): string {
  return (Array.isArray(param) ? param[0] : param) ?? ''
}
export const createTitleSetter = ($doc = document) => {
  return beforePaint((title) => {
    $doc.title = title
  })
}
export const createAttrsSetter = ($el = document.documentElement) => {
  if (!$el) {
    return () => {}
  }
  const originalClasses = [...$el.classList]
  return beforePaint((attrs: Record<string, string>[]) => {
    const flat = attrs.reduce<Record<string, string[]>>((prev, item) => {
      return Object.entries(item).reduce(
        (prev, [key, value]) => {
          if (typeof prev[key] === 'undefined') {
            prev[key] = []
          }
          prev[key].push(value)
          return prev
        }, prev,
      )
    }, {})

    $el.classList.remove(...[...$el.classList].filter(item => !originalClasses.includes(item)))
    $el.classList.add(...(flat.class || []))
  })
}
