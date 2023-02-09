<template>
  <div class="error-block">
    <KEmptyState cta-is-hidden>
      <template #title>
        <KIcon
          class="mb-3"
          icon="warning"
          color="var(--black-75)"
          secondary-color="var(--yellow-300)"
          size="42"
        />

        <p>An error has occurred while trying to load this data.</p>
      </template>

      <template
        v-if="error !== null || causes.length > 0"
        #message
      >
        <details class="error-block-details">
          <summary>Details</summary>

          <p v-if="error !== null">
            {{ error.message }}
          </p>

          <ul>
            <li
              v-for="(cause, index) in causes"
              :key="index"
            >
              <b><code>{{ cause.field }}</code></b>: {{ cause.message }}
            </li>
          </ul>
        </details>
      </template>
    </KEmptyState>

    <div
      v-if="error instanceof ApiError"
      class="badge-list"
    >
      <KBadge
        v-if="error.code"
        appearance="warning"
      >
        {{ error.code }}
      </KBadge>

      <KBadge appearance="warning">
        {{ error.statusCode }}
      </KBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { KBadge, KEmptyState, KIcon } from '@kong/kongponents'

import { ApiError } from '@/services/kuma-api/ApiError'

const props = defineProps({
  error: {
    type: [Error, null] as PropType<Error | null>,
    required: false,
    default: null,
  },
})

const causes = computed(() => props.error instanceof ApiError ? props.error.causes : [])
</script>

<style scoped>
.error-block {
  position: relative;
}

.error-block-details {
  text-align: left;
}

.badge-list {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  display: flex;
}

.badge-list > * + * {
  margin-left: var(--spacing-xs);
}
</style>
