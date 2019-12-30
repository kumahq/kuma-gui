import Vue from 'vue'

import KAlert from '@kongponents/kalert'
import KBadge from '@kongponents/kbadge'
import KButton from '@kongponents/kbutton'
import KCard from '@kongponents/kcard'
import KEmptyState from '@kongponents/kemptystate'
import KIcon from '@kongponents/kicon'
import KTable from '@kongponents/ktable'
import KToaster from '@kongponents/ktoaster'
import KoolTip from '@kongponents/kooltip'
import KClipboardProvider from '@kongponents/kclipboardprovider'
import Krumbs from '@kongponents/krumbs'
import KPop from '@kongponents/kpop'
import KToggle from '@kongponents/ktoggle'

// these 2 modules throw an error, hidden for now since they're not in use
// import KModal from '@kongponents/kmodal'
// import KInput from '@kongponents/kinput'

Vue.component('KAlert', KAlert)
// Vue.component('KBadge', KBadge)
Vue.component('KButton', KButton)
Vue.component('KCard', KCard)
Vue.component('KEmptyState', KEmptyState)
Vue.component('KIcon', KIcon)
Vue.component('KTable', KTable)
Vue.component('KToaster', KToaster)
Vue.component('KoolTip', KoolTip)
Vue.component('KClipboardProvider', KClipboardProvider)
Vue.component('Krumbs', Krumbs)
Vue.component('KPop', KPop)
// Vue.component('KToggle', KToggle)

// disabled until fixed
// Vue.component('KInput', KInput)
// Vue.component('KModal', KModal)
