<template>
  <XI18n
    v-slot="{ t }"
  >
    <AppAboutSection
      v-bind="attrs"
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
  </XI18n>
</template>

<script setup lang="ts">
import { AppAboutSection } from '@kong-ui-public/app-layout'
import { useAttrs } from 'vue'

const props = defineProps<{
  created?: string
  modified?: string
}>()
const slots = defineSlots()
const attrs = useAttrs()

</script>

<style lang="scss" scoped>
:deep(.about-section-content) {
  * {
    font-size: $kui-font-size-20;
  }
}
</style>
