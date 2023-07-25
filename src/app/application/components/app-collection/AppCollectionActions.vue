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
            color="var(--black-400)"
            icon="more"
            size="16"
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
import {
  KDropdownMenu,
  KButton,
  KIcon,
} from '@kong/kongponents'
</script>
