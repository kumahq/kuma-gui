import {
  KCard,
  KPop,
  KRadio,
  KLabel,
} from '@kong/kongponents'

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

const deps = {
  i18n: {
    t: (str: string, _values?: Record<string, string>, _options?: Record<string, unknown>) => str,
    locale: 'en-us',
  },
  protocolHandler: (href: string) => href,
}
const plugin: Plugin = {
  install: (app, options: Partial<typeof deps> = {}) => {
    if (typeof options.i18n !== 'undefined') {
      deps.i18n = options.i18n
    }
    if (typeof options.protocolHandler !== 'undefined') {
      deps.protocolHandler = options.protocolHandler
    }
    components.forEach(([name, item]) => {
      app.component(name, item)
    })
    directives.forEach(([name, item]) => {
      app.directive(name, item)
    })
  },
}
export default plugin
export const useI18n = () => deps.i18n
export const useProtocolHandler = () => deps.protocolHandler
