<template>
  <div class="definition-list-item">
    <dt class="definition-list-item__term">
      {{ term }}
    </dt>

    <dd class="definition-list-item__details">
      <slot />
    </dd>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { getTermLabel } from '@/utilities/getTermLabel'
import { useI18n } from '@/utilities/useI18n'

const i18n = useI18n()

const props = defineProps({
  term: {
    type: String,
    required: true,
  },
})

const term = computed(() => getTermLabel(props.term, i18n))
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
  font-weight: 600;
}

.definition-list-item__details {
  flex-grow: 1;
}
</style>
