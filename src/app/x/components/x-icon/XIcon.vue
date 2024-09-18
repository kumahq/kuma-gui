<template>
  <component
    :is="slots.default ? KTooltip : AnonymousComponent"
    :placement="props.placement"
  >
    <component
      v-bind="attrs"
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
  WarningIcon,
  PortalIcon,
  MeshIcon,
  BookIcon,
  FilterIcon,
  CopyIcon,
  RuntimeKicIcon,
  DeployIcon,
  MoreIcon,
  ChevronDownIcon,
  CogIcon,
  AddIcon,
  HelpIcon,
  RefreshIcon,
} from '@kong/icons'
import { KTooltip, PopPlacements } from '@kong/kongponents'
import { useSlots, useAttrs } from 'vue'

import { uniqueId } from '@/app/application'
import AnonymousComponent from '@/app/application/components/anonymous-component/AnonymousComponent.vue'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const icons = {
  standard: 'span',
  'policy-role-producer': 'span',
  builtin: PortalIcon,
  delegated: PortalIcon,
  warning: WarningIcon,
  mesh: MeshIcon,
  docs: BookIcon,
  search: FilterIcon,
  copy: CopyIcon,
  more: MoreIcon,
  expand: ChevronDownIcon,
  kubernetes: RuntimeKicIcon,
  universal: DeployIcon,
  settings: CogIcon,
  help: HelpIcon,
  create: AddIcon,
  refresh: RefreshIcon,
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
.x-icon-mesh-icon {
  --meshIconColor: #{$kui-color-text-decorative-aqua};
}
.x-icon-icon {
  --warningIconColor: #ffa600;
}
.x-icon-standard-icon {
  --icon-before: url('@/assets/images/east-west.svg');
  &::before {
    position: relative;
    top: 3px;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    content: '';
    background-color: var(--icon-before-color, currentColor);
    display: inline-flex;

    mask-image: var(--icon-before);
    -webkit-mask-image: var(--icon-before);
    mask-size: 100%;
    -webkit-mask-size: 100%;
    width: v-bind('props.size');
    height: v-bind('props.size');
  }
}
.x-icon-policy-role-producer-icon {
  &::before {
    content: 'P';
    color: var(--icon-before-color, currentColor);
    display: inline-flex;

    width: v-bind('props.size');
    height: v-bind('props.size');
  }
}

</style>
<style lang="scss">
[id^='-x-icon-tooltip'] ul {
  padding-left: $kui-space-60;
}
[id^='-x-icon-tooltip'] ul li:first-child:last-child {
  margin-left: calc(0px - $kui-space-60);
  list-style-type: none;
}
</style>
