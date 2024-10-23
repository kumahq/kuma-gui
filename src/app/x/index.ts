import Kongponents, { KCard, KBadge } from '@kong/kongponents'

import XAction from './components/x-action/XAction.vue'
import XActionGroup from './components/x-action-group/XActionGroup.vue'
import XBadge from './components/x-badge/XBadge.vue'
import XBreadcrumbs from './components/x-breadcrumbs/XBreadcrumbs.vue'
import XCopyButton from './components/x-copy-button/XCopyButton.vue'
import XDisclosure from './components/x-disclosure/XDisclosure.vue'
import XEmptyState from './components/x-empty-state/XEmptyState.vue'
import XIcon from './components/x-icon/XIcon.vue'
import XInput from './components/x-input/XInput.vue'
import XLayout from './components/x-layout/XLayout.vue'
import XPrompt from './components/x-prompt/XPrompt.vue'
import XProvider from './components/x-provider/XProvider.vue'
import XSelect from './components/x-select/XSelect.vue'
import XTabs from './components/x-tabs/XTabs.vue'
import XTeleportSlot from './components/x-teleport/XTeleportSlot.vue'
import XTeleportTemplate from './components/x-teleport/XTeleportTemplate.vue'
import locales from './locales/en-us/index.yaml'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

declare module 'vue' {
  export interface GlobalComponents {
    XIcon: typeof XIcon
    XInput: typeof XInput
    XAction: typeof XAction
    XActionGroup: typeof XActionGroup
    XCard: typeof KCard
    XBadge: typeof KBadge
    XCopyButton: typeof XCopyButton
    XBreadcrumbs: typeof XBreadcrumbs
    XEmptyState: typeof XEmptyState
    XLayout: typeof XLayout
    XPrompt: typeof XPrompt
    XProvider: typeof XProvider
    XSelect: typeof XSelect
    XTabs: typeof XTabs
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
    XDisclosure: typeof XDisclosure
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
          ['XAction', XAction],
          ['XActionGroup', XActionGroup],
          ['XBadge', XBadge],
          ['XBreadcrumbs', XBreadcrumbs],
          ['XCard', KCard],
          ['XCopyButton', XCopyButton],
          ['XEmptyState', XEmptyState],
          ['XIcon', XIcon],
          ['XInput', XInput],
          ['XLayout', XLayout],
          ['XPrompt', XPrompt],
          ['XProvider', XProvider],
          ['XSelect', XSelect],
          ['XTabs', XTabs],
          ['XTeleportTemplate', XTeleportTemplate],
          ['XTeleportSlot', XTeleportSlot],
          ['XDisclosure', XDisclosure],
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
