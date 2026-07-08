import {
  KPop,
  KLabel,
  KCodeBlock,
} from '@kong/kongponents'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { inject } from 'vue'

import {
  XAction,
  XActionGroup,
  XAlert,
  XAnonymous,
  XBadge,
  XBreadcrumbs,
  XCard,
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
  XRadio,
  XRouter,
  XSearch,
  XSelect,
  XTable,
  XTabs,
  XTeleportSlot,
  XTeleportTemplate,
  XTheme,
  XTimespan,
  XTooltip,
  XWindow,
  XErrorState,
} from './components'
import { vStyle, vIcon }  from './directives/'
import type { App, Plugin, InjectionKey } from 'vue'

export * from './components'

const components = [
  ['XAlert', XAlert],
  ['XCard', XCard],
  ['XLabel', KLabel],
  ['XPop', KPop],
  ['XRadio', XRadio],
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
  ['XRouter', XRouter],
  ['XSelect', XSelect],
  ['XTabs', XTabs],
  ['XTable', XTable],
  ['XTeleportTemplate', XTeleportTemplate],
  ['XTeleportSlot', XTeleportSlot],
  ['XTheme', XTheme],
  ['XTimespan', XTimespan],
  ['XTooltip', XTooltip],
  ['XDisclosure', XDisclosure],
  ['XDownload', XDownload],
  ['XDrawer', XDrawer],
  ['XInputSwitch', XInputSwitch],
  ['XCheckbox', XCheckBox],
  ['XWindow', XWindow],
  ['XSearch', XSearch],
  ['XErrorState', XErrorState],
] as const

const directives = [
  ['style', vStyle()],
  ['icon-start', vIcon('start')],
  ['icon-end', vIcon('end')],
] as const

declare module 'vue' {
  export interface GlobalComponents {
    XCard: typeof XCard
    XLabel: typeof KLabel
    XPop: typeof KPop
    XRadio: typeof XRadio
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
    XRouter: typeof XRouter
    XSelect: typeof XSelect
    XTabs: typeof XTabs
    XTable: typeof XTable
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
    XTheme: typeof XTheme
    XTimespan: typeof XTimespan
    XTooltip: typeof XTooltip
    XDisclosure: typeof XDisclosure
    XDownload: typeof XDownload
    XInputSwitch: typeof XInputSwitch
    XCheckbox: typeof XCheckBox
    XWindow: typeof XWindow
    XSearch: typeof XSearch
    XErrorState: typeof XErrorState
  }
}

/* copy/pasta-ble containers */
declare const typeSymbol: unique symbol
type Uri<T = unknown> = { [typeSymbol]: T }
type TypeOf<T> = T extends Uri<infer UriType> ? UriType : never
type InjectionHooks<T extends Uri[]> = { [K in keyof T]: T[K] extends Uri ? () => TypeOf<T[K]> : never }
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
type Container = ReturnType<typeof nano>
/* */

const createInjections = <T extends Uri[]>(...tokens: T): InjectionHooks<T> => {
  return tokens.map((token) => {
    return () => {
      type Service = TypeOf<typeof token>
      type Getter = () => Service
      const service = inject(token as unknown as InjectionKey<Getter>) as () => TypeOf<typeof token>
      if(typeof service === 'undefined') {
        throw new Error('Unable to find injection ${token}')
      }
      return service()
    }
  }) as InjectionHooks<T>
}
const createBuilder = (container: Container) => {
  const { singleton, uri } = container
  const build = (app: App) => {
    const builder = {
      service: <T>(uri: Uri<T>, getter: () => T) => {
        app.provide(uri as unknown as InjectionKey<typeof getter>, singleton(uri, getter))
        return builder
      },
    }
    return builder
  }
  return { build, uri }
}

const { uri } = nano()

const deps = {
  i18n: {
    t: (str: string, _values?: Record<string, string>, _options?: Record<string, unknown>) => str,
    locale: 'en-us',
  },
  routerElement: () => document.body,
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
const tokens = {
  i18n: uri<typeof deps.i18n>('x.i18n'),
  protocolHandler: uri<typeof deps.protocolHandler>('x.action.protocolhandler'),
  syntaxHighlighter: uri<typeof deps.syntaxHighlighter>('x.code-block.syntaxhighlighter'),
  routerElement: uri<HTMLElement>('x.router.routerElement'),
}
const plugin: Plugin = {
  install: (app, options: Partial<typeof deps> = {}) => {
    const services = {
      ...deps,
      ...options,
    }

    const { build } = createBuilder(nano())
    build(app)
      .service(tokens.syntaxHighlighter, () => {
        const syntax = deps.syntaxHighlighter()
        return async () => syntax
      })
      .service(tokens.protocolHandler, () => services.protocolHandler)
      .service(tokens.i18n, () => services.i18n)
      .service(tokens.routerElement, services.routerElement)

    components.forEach(([name, item]) => {
      app.component(name, item)
    })
    directives.forEach(([name, item]) => {
      app.directive(name, item)
    })
  },
}
export const [
  useI18n,
  useSyntaxHighlighter,
  useProtocolHandler,
  useRouterElement,
] = createInjections(
  tokens.i18n,
  tokens.syntaxHighlighter,
  tokens.protocolHandler,
  tokens.routerElement,
)
export default plugin
