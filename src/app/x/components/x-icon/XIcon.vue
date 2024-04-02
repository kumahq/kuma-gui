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
      :color="props.color"
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
} from '@kong/icons'
import { KTooltip, PopPlacements } from '@kong/kongponents'
import { useSlots } from 'vue'

import { uniqueId } from '@/app/application'
import AnonymousComponent from '@/app/application/components/anonymous-component/AnonymousComponent.vue'

const icons = {
  standard: MeshIcon,
  builtin: PortalIcon,
  delegated: ProfileTeamIcon,
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
  color: 'currentColor',
  size: KUI_ICON_SIZE_30,
})
</script>
