// A shadow root means none of the document's stylesheets apply within it, so we
// clone them into constructable stylesheets, which can then be adopted by, and
// are shared between, every shadow root that uses them.
//
// Note: anything relying on an ancestor outside of the shadow root, `html.dark`
// for example, still won't match.
let adopted: { length: number, sheets: CSSStyleSheet[] } = {
  length: -1,
  sheets: [],
}

const clone = (sheet: CSSStyleSheet) => {
  let rules: CSSRuleList
  try {
    rules = sheet.cssRules
  } catch {
    console.error("CrossOrigin stylesheet can't be read, and therefore can't be cloned")
    return
  }
  const clone = new CSSStyleSheet({ media: sheet.media.mediaText })
  clone.replaceSync(Array.from(rules).map((rule) => rule.cssText).join('\n'))
  return clone
}

export const documentStyleSheets = (): CSSStyleSheet[] => {
  // lazily loaded chunks add stylesheets as we go, so we re-clone whenever the
  // document has more/less than we last saw
  if (adopted.length !== document.styleSheets.length) {
    adopted = {
      length: document.styleSheets.length,
      sheets: Array.from(document.styleSheets).reduce<CSSStyleSheet[]>((prev, item) => {
        const sheet = clone(item)
        if (typeof sheet !== 'undefined') {
          prev.push(sheet)
        }
        return prev
      }, []),
    }
  }
  return adopted.sheets
}

export const adoptDocumentStyleSheets = (shadowRoot: ShadowRoot) => {
  shadowRoot.adoptedStyleSheets = documentStyleSheets()
}
