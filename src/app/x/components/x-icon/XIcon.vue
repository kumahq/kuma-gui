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
      class="x-icon-icon"
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
  DeployIcon,
  WarningIcon,
} from '@kong/icons'
import { KTooltip, PopPlacements } from '@kong/kongponents'
import { useSlots } from 'vue'

import { uniqueId } from '@/app/application'
import AnonymousComponent from '@/app/application/components/anonymous-component/AnonymousComponent.vue'

const icons = {
  standard: MeshIcon,
  builtin: DeployIcon,
  delegated: DeployIcon,
  warning: WarningIcon,
} as const
const id = uniqueId('-x-icon-tooltip')
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
.x-icon-icon {
  --warningIconColor: #ffa600;
  --standardIconColor: #250d50;
  --delegatedIconColor: #4ca58e;
  --builtinIconColor: #c25398;
}
</style>
<style lang="scss">
[id^='-x-icon-tooltip'] ul {
  padding-left: $kui-space-50;
}
</style>
