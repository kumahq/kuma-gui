<template>
  <div class="definition-list-item">
    <dt class="definition-list-item__term">
      {{ currentTerm }}
    </dt>

    <dd class="definition-list-item__details">
      <slot />
    </dd>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps({
  term: {
    type: String,
    required: true,
  },
})

const currentTerm = computed(() => t(`http.api.property.${props.term}`))
</script>

<style lang="scss" scoped>
.definition-list-item {
  --dl-term-width: 170px;

  display: flex;
}

.definition-list-item__term {
  flex-shrink: 0;
  flex-basis: var(--dl-term-width);
  margin-right: var(--spacing-sm);
  font-weight: var(--font-weight-semi-bold);
}

.definition-list-item__details {
  flex-grow: 1;
}
</style>
