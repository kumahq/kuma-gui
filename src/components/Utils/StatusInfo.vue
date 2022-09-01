<template>
  <div class="status-info">
    <KEmptyState
      v-if="isLoading"
      cta-is-hidden
      data-testid="status-info-loading-section"
    >
      <template #title>
        <div class="card-icon mb-3">
          <KIcon
            icon="spinner"
            color="rgba(0, 0, 0, 0.1)"
            size="42"
          />
        </div>

        Data Loading...
      </template>
    </KEmptyState>

    <template v-else-if="hasError">
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

          <template v-if="shouldShowApiError">
            {{ error.message }}
          </template>

          <template v-else>
            An error has occurred while trying to load this data.
          </template>
        </template>

        <template
          v-if="shouldShowApiError && Array.isArray(error.causes) && error.causes.length > 0"
          #message
        >
          <details>
            <summary>Details</summary>

            <ul>
              <li
                v-for="(cause, index) in error.causes"
                :key="index"
              >
                <b><code>{{ cause.field }}</code></b>: {{ cause.message }}
              </li>
            </ul>
          </details>
        </template>
      </KEmptyState>

      <div
        v-if="shouldShowApiError"
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
    </template>

    <KEmptyState
      v-else-if="isEmpty"
      cta-is-hidden
    >
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

        There is no data to display.
      </template>
    </KEmptyState>

    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script>
import { KBadge, KEmptyState, KIcon } from '@kong/kongponents'

import { ApiError } from '@/services/ApiError'

export default {
  name: 'StatusInfo',

  components: {
    KBadge,
    KEmptyState,
    KIcon,
  },

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    hasError: {
      type: Boolean,
      default: false,
    },

    isEmpty: {
      type: Boolean,
      default: false,
    },

    error: {
      type: Object,
      required: false,
      default: null,
    },
  },

  computed: {
    shouldShowApiError() {
      return this.error instanceof ApiError
    },
  },
}
</script>

<style lang="scss">
.k-empty-state-message {
  text-align: left;
}
</style>

<style lang="scss" scoped>
.status-info {
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
