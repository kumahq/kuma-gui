<template>
  <KDropdownMenu
    class="actions-dropdown"
    :kpop-attributes="{ placement: 'bottomEnd', popoverClasses: 'mt-5 more-actions-popover' }"
    width="150"
  >
    <template #default>
      <KButton
        class="non-visual-button"
        appearance="secondary"
        size="small"
      >
        <template #icon>
          <KIcon
            :color="KUI_COLOR_TEXT_NEUTRAL_STRONGER"
            icon="more"
            :size="KUI_ICON_SIZE_30"
          />
        </template>
      </KButton>
    </template>
    <template #items>
      <slot name="default" />
    </template>
  </KDropdownMenu>
</template>
<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_STRONGER, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import {
  KDropdownMenu,
  KButton,
  KIcon,
} from '@kong/kongponents'
</script>
