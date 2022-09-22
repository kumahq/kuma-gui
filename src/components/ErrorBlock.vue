<template>
  <div class="error-block">
    <KEmptyState cta-is-hidden>
      <template #title>
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            icon="warning"
            color="var(--black-75)"
            secondary-color="var(--yellow-300)"
            size="42"
          />
        </div>

        <p>
          <template v-if="error instanceof ApiError">
            {{ error.message }}
          </template>

          <template v-else>
            An error has occurred while trying to load this data.
          </template>
        </p>
      </template>

      <template
        v-if="causes.length > 0"
        #message
      >
        <details>
          <summary>Details</summary>

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
import { computed } from 'vue'
import { KBadge, KEmptyState, KIcon } from '@kong/kongponents'

import { ApiError } from '@/services/ApiError'

const props = defineProps({
  error: {
    type: [Error, ApiError],
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
