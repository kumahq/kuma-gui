import {
  KCard,
  KPop,
  KRadio,
  KLabel,
  KCodeBlock,
} from '@kong/kongponents'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

import {
  XAboutCard,
  XAction,
  XActionGroup,
  XAlert,
  XAnonymous,
  XBadge,
  XBreadcrumbs,
  XCheckBox,
  XCodeBlock,
  XCopyButton,
  // we specifically don't globally register this
  // XCopyDebug,
  //
  XDisclosure,
  XDl,
  XDownload,
  XDrawer,
  XEmptyState,
  XI18n,
  XIcon,
  XInput,
  XInputSwitch,
  XLayout,
  XModal,
  XNotification,
  XNotificationHub,
  XProgress,
  XPrompt,
  XProvider,
  XSearch,
  XSelect,
  XTable,
  XTabs,
  XTeleportSlot,
  XTeleportTemplate,
  XTooltip,
  XWindow,
  XErrorState,
} from './components'
import vStyle from './directives/style'
import type { Plugin } from 'vue'

export * from './components'

const components = [
  ['XAlert', XAlert],
  ['XCard', KCard],
  ['XLabel', KLabel],
  ['XPop', KPop],
  ['XRadio', KRadio],
  //
  ['XAction', XAction],
  ['XActionGroup', XActionGroup],
  ['XAnonymous', XAnonymous],
  ['XBadge', XBadge],
  ['XBreadcrumbs', XBreadcrumbs],
  ['XCopyButton', XCopyButton],
  ['XCodeBlock', XCodeBlock],
  // temporarily global, these will be moved to become internal
  ['XReadOnlyCodeBlock', KCodeBlock],
  ['XReadWriteCodeBlock', KCodeBlock],
  //
  ['XDl', XDl],
  ['XEmptyState', XEmptyState],
  ['XIcon', XIcon],
  ['XI18n', XI18n],
  ['XInput', XInput],
  ['XLayout', XLayout],
  ['XModal', XModal],
  ['XNotification', XNotification],
  ['XNotificationHub', XNotificationHub],
  ['XPrompt', XPrompt],
  ['XProvider', XProvider],
  ['XProgress', XProgress],
  ['XSelect', XSelect],
  ['XTabs', XTabs],
  ['XTable', XTable],
  ['XTeleportTemplate', XTeleportTemplate],
  ['XTeleportSlot', XTeleportSlot],
  ['XTooltip', XTooltip],
  ['XDisclosure', XDisclosure],
  ['XDownload', XDownload],
  ['XDrawer', XDrawer],
  ['XAboutCard', XAboutCard],
  ['XInputSwitch', XInputSwitch],
  ['XCheckbox', XCheckBox],
  ['XWindow', XWindow],
  ['XSearch', XSearch],
  ['XErrorState', XErrorState],
] as const

const directives = [
  ['style', vStyle()],
] as const

declare module 'vue' {
  export interface GlobalComponents {
    XCard: typeof KCard
    XLabel: typeof KLabel
    XPop: typeof KPop
    XRadio: typeof KRadio
    //
    XAlert: typeof XAlert
    XAnonymous: typeof XAnonymous
    XIcon: typeof XIcon
    XI18n: typeof XI18n
    XInput: typeof XInput
    XAction: typeof XAction
    XActionGroup: typeof XActionGroup
    XBadge: typeof XBadge
    XCopyButton: typeof XCopyButton
    XCodeBlock: typeof XCodeBlock
    // temporarily global, these will be moved to become internal
    XReadOnlyCodeBlock: typeof KCodeBlock
    XReadWriteCodeBlock: typeof KCodeBlock
    //
    XDl: typeof XDl
    XBreadcrumbs: typeof XBreadcrumbs
    XEmptyState: typeof XEmptyState
    XLayout: typeof XLayout
    XModal: typeof XModal
    XNotification: typeof XNotification
    XNotificationHub: typeof XNotificationHub
    XPrompt: typeof XPrompt
    XProvider: typeof XProvider
    XProgress: typeof XProgress
    XSelect: typeof XSelect
    XTabs: typeof XTabs
    XTable: typeof XTable
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
    XTooltip: typeof XTooltip
    XDisclosure: typeof XDisclosure
    XDownload: typeof XDownload
    XAboutCard: typeof XAboutCard
    XInputSwitch: typeof XInputSwitch
    XCheckbox: typeof XCheckBox
    XWindow: typeof XWindow
    XSearch: typeof XSearch
  }
}

/* copy/pasta-ble containers */
declare const typeSymbol: unique symbol
type Uri<T = unknown> = { [typeSymbol]: T }
type TypeOf<T> = T extends Uri<infer UriType> ? UriType : never
//

/* nano-container */
const nano = (map = new Map<Uri, unknown>()) => {
  type Service<T> = () => TypeOf<T>
  const uri = <T>(str: string): Uri<T> => Symbol.for(str) as symbol & Uri<T>
  const singleton = <T extends Uri>(uri: T, value: Service<T> | undefined) => () => {
    if (typeof value !== 'undefined' && !map.has(uri)) {
      map.set(uri, value())
    }
    return map.get(uri) as TypeOf<T>
  }
  return { singleton, uri }
}
/* */
const deps = {
  i18n: {
    t: (str: string, _values?: Record<string, string>, _options?: Record<string, unknown>) => str,
    locale: 'en-us',
  },
  protocolHandler: (href: string) => href,
  syntaxHighlighter: async () => {
    return createHighlighterCore({
      langs: [
        import('shiki/langs/json.mjs'),
        import('shiki/langs/yaml.mjs'),
        import('shiki/langs/bash.mjs'),
      ],
      themes: [
        {
          name: 'catppuccin-mocha',
          default: (await import('shiki/themes/catppuccin-mocha.mjs')).default,
        },
      ],
      engine: createJavaScriptRegexEngine(),
    })
  },
}
const { singleton, uri } = nano()
const tokens = {
  i18n: uri<typeof deps.i18n>('x.i18n'),
  protocolHandler: uri<typeof deps.protocolHandler>('x.action.protocolhandler'),
  syntaxHighlighter: uri<typeof deps.syntaxHighlighter>('x.code-block.syntaxhighlighter'),
}

export const useI18n = singleton(tokens.i18n, () => deps.i18n)
export const useProtocolHandler = singleton(tokens.protocolHandler, () => deps.protocolHandler)
export const useSyntaxHighlighter = singleton(tokens.syntaxHighlighter, () => {
  const syntax = deps.syntaxHighlighter()
  return async () => syntax
})

const plugin: Plugin = {
  install: (app, options: Partial<typeof deps> = {}) => {
    Object.assign(deps, options)
    components.forEach(([name, item]) => {
      app.component(name, item)
    })
    directives.forEach(([name, item]) => {
      app.directive(name, item)
    })
  },
}
export default plugin
