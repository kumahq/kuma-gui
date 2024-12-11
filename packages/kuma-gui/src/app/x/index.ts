import Kongponents, { KTooltip, KCard, KPop, KInputSwitch, KAlert, KCheckbox } from '@kong/kongponents'

import XAboutSection from './components/x-about-section/XAboutSection.vue'
import XAction from './components/x-action/XAction.vue'
import XActionGroup from './components/x-action-group/XActionGroup.vue'
import XBadge from './components/x-badge/XBadge.vue'
import XBreadcrumbs from './components/x-breadcrumbs/XBreadcrumbs.vue'
import XCodeBlock from './components/x-code-block/XCodeBlock.vue'
import XCopyButton from './components/x-copy-button/XCopyButton.vue'
import XDisclosure from './components/x-disclosure/XDisclosure.vue'
import XEmptyState from './components/x-empty-state/XEmptyState.vue'
import XI18n from './components/x-i18n/XI18n.vue'
import XIcon from './components/x-icon/XIcon.vue'
import XInput from './components/x-input/XInput.vue'
import XLayout from './components/x-layout/XLayout.vue'
import XPrompt from './components/x-prompt/XPrompt.vue'
import XProvider from './components/x-provider/XProvider.vue'
import XSelect from './components/x-select/XSelect.vue'
import XTabs from './components/x-tabs/XTabs.vue'
import XTeleportSlot from './components/x-teleport/XTeleportSlot.vue'
import XTeleportTemplate from './components/x-teleport/XTeleportTemplate.vue'
import XTimespan from './components/x-timespan/XTimespan.vue'
import locales from './locales/en-us/index.yaml'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

declare module 'vue' {
  export interface GlobalComponents {
    XAlert: typeof KAlert
    XCard: typeof KCard
    XPop: typeof KPop
    XInputSwitch: typeof KInputSwitch
    XCheckbox: typeof KCheckbox
    XTooltip: typeof KTooltip
    //
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
    XPrompt: typeof XPrompt
    XProvider: typeof XProvider
    XSelect: typeof XSelect
    XTabs: typeof XTabs
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
    XTimespan: typeof XTimespan
    XDisclosure: typeof XDisclosure
    XAboutSection: typeof XAboutSection
  }
}

const $ = {
  xVueComponents: token('x.vue.components'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('kong.plugins'), {
      service: () => {
        return [
          [Kongponents],
        ]
      },
      labels: [
        app.plugins,
      ],
    }],

    [$.xVueComponents, {
      service: () => {
        return [
          ['XAlert', KAlert],
          ['XCard', KCard],
          ['XPop', KPop],
          ['XInputSwitch', KInputSwitch],
          ['XCheckbox', KCheckbox],
          ['XTooltip', KTooltip],
          //
          ['XAction', XAction],
          ['XActionGroup', XActionGroup],
          ['XBadge', XBadge],
          ['XBreadcrumbs', XBreadcrumbs],
          ['XCopyButton', XCopyButton],
          ['XCodeBlock', XCodeBlock],
          ['XEmptyState', XEmptyState],
          ['XIcon', XIcon],
          ['XI18n', XI18n],
          ['XInput', XInput],
          ['XLayout', XLayout],
          ['XPrompt', XPrompt],
          ['XProvider', XProvider],
          ['XSelect', XSelect],
          ['XTabs', XTabs],
          ['XTeleportTemplate', XTeleportTemplate],
          ['XTeleportSlot', XTeleportSlot],
          ['XTimespan', XTimespan],
          ['XDisclosure', XDisclosure],
          ['XAboutSection', XAboutSection],
        ]
      },
      labels: [
        app.components,
      ],
    }],
    [token('x.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
export const TOKENS = $
