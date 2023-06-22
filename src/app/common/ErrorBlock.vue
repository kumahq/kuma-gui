<template>
  <div class="error-block">
    <KEmptyState cta-is-hidden>
      <template #title>
        <KIcon
          class="mb-3"
          :icon="props.icon"
          :color="props.icon === 'warning' ? 'var(--black-500)' : undefined"
          :secondary-color="props.icon === 'warning' ? 'var(--yellow-300)' : undefined"
          size="42"
        />

        <slot>
          <p>An error has occurred while trying to load this data.</p>
        </slot>
      </template>

      <template
        v-if="slots.message || error !== null || causes.length > 0"
        #message
      >
        <template v-if="slots.message">
          <slot name="message" />
        </template>

        <details
          v-else
          class="error-block-details"
        >
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
      v-if="(error instanceof ApiError)"
      class="badge-list"
    >
      <KBadge
        v-if="error.code"
        :appearance="props.badgeAppearance"
      >
        {{ error.code }}
      </KBadge>

      <KBadge :appearance="props.badgeAppearance">
        {{ error.statusCode }}
      </KBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type BadgeAppearance, KBadge, KEmptyState, KIcon } from '@kong/kongponents'
import { computed, PropType, useSlots } from 'vue'

import { ApiError } from '@/services/kuma-api/ApiError'

const slots = useSlots()

const props = defineProps({
  error: {
    type: [Error, null] as PropType<Error | null>,
    required: false,
    default: null,
  },

  icon: {
    type: String,
    required: false,
    default: 'warning',
  },

  badgeAppearance: {
    type: String as PropType<BadgeAppearance>,
    required: false,
    default: 'warning',
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
