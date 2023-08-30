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
          <p>{{ error instanceof ApiError ? error.detail : t('common.error_state.title') }}</p>
        </slot>
      </template>

      <template #message>
        <slot
          v-if="$slots.message"
          name="message"
        />

        <p v-else>
          {{ error.message }}
        </p>

        <details
          v-if="invalidParameters.length > 0"
          class="error-block-details"
          data-testid="error-invalid-parameters"
        >
          <summary>{{ t('common.error_state.details') }}</summary>

          <ul>
            <li
              v-for="(parameter, index) in invalidParameters"
              :key="index"
            >
              {{ t('common.error_state.field') }} <b><code>{{ parameter.field }}</code></b>: {{ parameter.reason }}
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
        :appearance="props.badgeAppearance"
        data-testid="error-status"
      >
        {{ error.status }}
      </KBadge>

      <KBadge
        v-if="error.type"
        appearance="neutral"
        data-testid="error-type"
      >
        type: {{ error.type }}
      </KBadge>

      <KBadge
        v-if="error.instance"
        appearance="neutral"
        data-testid="error-trace"
      >
        trace: <TextWithCopyButton :text="error.instance" />
      </KBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_50 } from '@kong/design-tokens'
import { type BadgeAppearance, KBadge, KEmptyState, KIcon } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import { ApiError } from '@/services/kuma-api/ApiError'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps({
  error: {
    type: Error,
    required: true,
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
