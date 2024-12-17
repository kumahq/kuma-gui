<template>
  <AppAboutSection>
    <template
      v-for="(_, slotName) in $slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="(slotProps)"
      />
    </template>
  </AppAboutSection>
</template>

<script setup lang="ts">
import { AppAboutSection } from '@kong-ui-public/app-layout'
</script>

<style lang="scss" scoped>
:deep(.about-section-content) {
  .definition-card {
    align-self: center;

    &-title {
      font-size: $kui-font-size-20;
    }

    &-container {
      gap: $kui-space-20;
      font-size: $kui-font-size-20;
      font-weight: normal;
    }
  }
}
</style>
