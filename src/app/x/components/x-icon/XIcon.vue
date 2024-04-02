<template>
  <component
    :is="slots.default ? KTooltip : AnonymousComponent"
    :placement="props.placement"
  >
    <component
      :is="icons[props.name]"
      :aria-described-by="slots.default ? id : undefined"
      :decorative="!!slots.default"
      tabindex="0"
      :color="props.color ? props.color : `var(--${props.name}IconColor, 'currentColor')`"
      :size="props.size"
      display="inline-block"
    />

    <template #content>
      <div
        :id="id"
      >
        <slot
          v-if="slots.default"
          name="default"
        />
      </div>
    </template>
  </component>
</template>
<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import {
  MeshIcon,
  PortalIcon,
  ProfileTeamIcon,
  WarningIcon,
} from '@kong/icons'
import { KTooltip, PopPlacements } from '@kong/kongponents'
import { useSlots } from 'vue'

import { uniqueId } from '@/app/application'
import AnonymousComponent from '@/app/application/components/anonymous-component/AnonymousComponent.vue'

const icons = {
  standard: MeshIcon,
  builtin: PortalIcon,
  delegated: ProfileTeamIcon,
  warning: WarningIcon,
} as const
const id = uniqueId('x-icon')
const slots = useSlots()

const props = withDefaults(defineProps<{
  name: keyof typeof icons
  placement?: PopPlacements
  color?: string
  size?: string
}>(), {
  placement: 'auto',
  color: undefined,
  size: KUI_ICON_SIZE_30,
})
</script>
<style lang="scss" scoped>
.warning-icon {
  --warningIconColor: #ffa600;
}
</style>
<style lang="scss">
[id*='x-icon-'] ul {
  padding-left: $kui-space-50;
}
</style>
