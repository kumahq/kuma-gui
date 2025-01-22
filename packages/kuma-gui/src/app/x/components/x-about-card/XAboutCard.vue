<template>
  <AppAboutSection
    :created="props.created ? t('common.formats.datetime', { value: Date.parse(props.created)}) : undefined"
    :modified="props.modified ? t('common.formats.datetime', { value: Date.parse(props.modified)}) : undefined"
  >
    <template
      v-for="(_, slotName) in slots"
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
import { useI18n } from '@kong-ui-public/i18n'


const props = defineProps<{
  created?: string
  modified?: string
}>()
const slots = defineSlots()

const { t } = useI18n()
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
