<template>
  <div
    data-testid="error-state"
    class="error-block"
  >
    <KEmptyState cta-is-hidden>
      <template #title>
        <WarningIcon
          v-if="props.icon === 'warning'"
          class="mb-3"
          :size="KUI_ICON_SIZE_50"
        />

        <KIcon
          v-else
          class="mb-3"
          :icon="props.icon"
          :size="KUI_ICON_SIZE_50"
        />

        <slot>
          <p>An error has occurred while trying to load this data.</p>
        </slot>
      </template>

      <template
        v-if="$slots.message || error !== null || invalidParameters.length > 0"
        #message
      >
        <template v-if="$slots.message">
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

          <ul v-if="invalidParameters.length > 0">
            <li
              v-for="(parameter, index) in invalidParameters"
              :key="index"
            >
              <b><code>{{ parameter.field }}</code></b>: {{ parameter.reason }}
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
        v-if="error.type"
        :appearance="props.badgeAppearance"
      >
        {{ error.type }}
      </KBadge>

      <KBadge :appearance="props.badgeAppearance">
        {{ error.status }}
      </KBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_50 } from '@kong/design-tokens'
import { type BadgeAppearance, KBadge, KEmptyState, KIcon } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import WarningIcon from '@/app/common/WarningIcon.vue'
import { ApiError } from '@/services/kuma-api/ApiError'

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

const invalidParameters = computed(() => props.error instanceof ApiError ? props.error.invalidParameters : [])
</script>

<style lang="scss" scoped>
.error-block {
  position: relative;
}

.error-block-details {
  text-align: left;
}

.badge-list {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
}

.badge-list > * + * {
  margin-left: $kui-space-40;
}
</style>
