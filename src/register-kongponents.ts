import { App } from 'vue'
import {
  KAlert,
  KBadge,
  KButton,
  KCard,
  KEmptyState,
  KIcon,
  KTable,
  KClipboardProvider,
  KRadio,
  KPop,
  KTabs,
  KModal,
} from '@kong/kongponents'

export function registerKongponents(app: App) {
  app.component('KAlert', KAlert)
  app.component('KBadge', KBadge)
  app.component('KButton', KButton)
  app.component('KCard', KCard)
  app.component('KEmptyState', KEmptyState)
  app.component('KIcon', KIcon)
  app.component('KModal', KModal)
  app.component('KTable', KTable)
  app.component('KClipboardProvider', KClipboardProvider)
  app.component('KPop', KPop)
  app.component('KRadio', KRadio)
  app.component('KTabs', KTabs)
}
