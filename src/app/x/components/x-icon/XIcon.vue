<template>
  <component
    :is="slots.default ? KTooltip : AnonymousComponent"
    :placement="props.placement"
  >
    <component
      :is="icons[props.name]"
      :aria-described-by="slots.default ? id : undefined"
      :tabindex="slots.default ? 0 : undefined"
      :decorative="!!slots.default"
      :color="props.color ? props.color : `var(--${props.name}IconColor, 'currentColor')`"
      :size="props.size"
      display="inline-block"
      :class="`x-icon-icon x-icon-${props.name}-icon`"
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
  DeployIcon,
  WarningIcon,
} from '@kong/icons'
import { KTooltip, PopPlacements } from '@kong/kongponents'
import { useSlots } from 'vue'

import { uniqueId } from '@/app/application'
import AnonymousComponent from '@/app/application/components/anonymous-component/AnonymousComponent.vue'

const icons = {
  standard: 'span',
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
  --delegatedIconColor: #4ca58e;
  --builtinIconColor: #c25398;
}
.x-icon-standard-icon {
  --icon-before: url('@/assets/images/proxy.svg');
  --icon-before-color: #250d50;
}
.x-icon-standard-icon {
  &::before {
    position: relative;
    top: 2px;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    content: '';
    background-color: var(--icon-before-color, currentColor);
    display: inline-flex;
    margin-top: 2px;

    mask-image: var(--icon-before);
    -webkit-mask-image: var(--icon-before);
    width: 16px;
    height: 16px;
  }
}

</style>
<style lang="scss">
[id^='-x-icon-tooltip'] ul {
  padding-left: $kui-space-50;
}
</style>
