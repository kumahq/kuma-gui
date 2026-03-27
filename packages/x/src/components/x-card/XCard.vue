<template>
  <template
    v-if="created.length > 0 || modified.length > 0"
  >
    <AppAboutSection
      v-bind="attrs"
      :created="created"
      :modified="modified"
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
  <template
    v-else
  >
    <KCard
      v-bind="attrs"
      :class="{ 'in-x-action': xAction }"
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
    </KCard>
  </template>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { AppAboutSection } from '@kong-ui-public/app-layout'
import { inject, provide, ref, useAttrs } from 'vue'

const attrs = useAttrs()
const slots = defineSlots()
const xAction = inject<{} | undefined>('x-action', undefined)

const created = ref('')
const modified = ref('')

provide('x-card', {
  created,
  modified,
})
</script>
<style lang="scss" scoped>
/* copied from kong/kongponents KRadio::card=true */
.in-x-action {
  & {
    cursor: pointer;
    border: 0;
    box-shadow: var(--x-shadow-border);
    transition: box-shadow var(--x-animation-duration-20) ease-in-out, background-color var(--x-animation-duration-20) ease-in-out;
  }
  &:hover {
    box-shadow: var(--x-shadow-border-primary-weak);
  }
  &:active {
    box-shadow: var(--x-shadow-border-primary-strongest);
  }

  &:focus-visible {
    box-shadow: var(--x-shadow-border-primary-weak), var(--x-shadow-focus);
  }
}

/* smaller fonts for AppAboutSection */
:deep(.about-section-content) {
  * {
    font-size: var(--x-font-size-20);
  }
}
</style>
