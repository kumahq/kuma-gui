<template>
  <div
    class="tray"
    data-testid="tray"
  >
    <header class="tray-header">
      <div class="tray-title-wrapper">
        <span
          v-if="$slots.icon"
          class="tray-icon"
        >
          <slot name="icon" />
        </span>

        <h2 class="tray-title">
          <slot name="title" />
        </h2>
      </div>

      <KButton
        appearance="btn-link"
        class="non-visual-button"
        data-testid="close-tray-button"
        @click="emit('close')"
      >
        <CloseIcon aria-hidden="true" />

        <span class="visually-hidden">{{ t('common.tray.close') }}</span>
      </KButton>
    </header>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import { CloseIcon } from '@kong/icons'

import { useI18n } from '@/utilities'

const { t } = useI18n()

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<style lang="scss" scoped>
.tray {
  position: fixed;
  z-index: 100;
  top: var(--AppHeaderHeight);
  bottom: 0;
  right: 0;
  width: 600px;
  max-width: calc(100% - var(--AppSidebarWidth));
  padding: $kui-space-70;
  border-left: $kui-border-width-10 solid $kui-color-border;
  background-color: $kui-color-background;
  box-shadow: -6px 0px 15px 0px rgba(0, 0, 0, 0.04);
}

.tray-header {
  display: flex;
  align-items: center;
  gap: $kui-space-50;
  justify-content: space-between;
  margin-bottom: $kui-space-50;
}

.tray-title-wrapper {
  display: flex;
  align-items: center;
  gap: $kui-space-30;
}

.tray-title {
  margin-top: 0;
}
</style>
