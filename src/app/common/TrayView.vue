<template>
  <KSlideout
    close-button-alignment="end"
    :has-overlay="false"
    is-visible
    prevent-close-on-blur
    data-testid="tray"
    @close="emit('close')"
  >
    <template
      v-if="$slots.icon"
      #before-title
    >
      <div class="tray-title-wrapper">
        <slot name="icon" />

        <h2 class="tray-title">
          <slot name="title" />
        </h2>
      </div>
    </template>

    <slot />
  </KSlideout>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<style lang="scss" scoped>

.tray-title-wrapper {
  display: flex;
  align-items: center;
  gap: $kui-space-30;
}

.tray-title {
  margin-top: 0;
}
</style>

<style lang="scss">
.k-slideout {
  // Overrides KSlideout’s override.
  --KCardPaddingX: #{$kui-space-80} !important;
  --KCardPaddingY: #{$kui-space-80} !important;
}

.k-slideout .panel,
.k-slideout .panel-background,
.k-slideout .panel-background-transparent {
  // Overrides KSlideout’s top offset. `props.offsetTop` doesn’t accept plain CSS values.
  top: var(--AppHeaderHeight) !important;
}

.k-slideout-header-content {
  padding-right: $kui-space-80;
  padding-left: $kui-space-80;
}
</style>
