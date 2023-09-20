<template>
  <div
    data-testid="error-state"
    class="error-block"
  >
    <KEmptyState cta-is-hidden>
      <template #title>
        <div class="error-block-header">
          <div class="error-block-title">
            <WarningIcon
              v-if="props.icon === 'warning'"
              :size="KUI_ICON_SIZE_50"
            />

            <KIcon
              v-else
              :icon="props.icon"
              :size="KUI_ICON_SIZE_50"
            />

            <slot>
              <p>{{ error instanceof ApiError ? error.detail : t('common.error_state.title') }}</p>
            </slot>
          </div>

          <span
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
          </span>
        </div>
      </template>

      <template #message>
        <div class="error-block-message">
          <slot
            v-if="$slots.message"
            name="message"
          />

          <p v-else>
            {{ error.message }}
          </p>

          <ul
            v-if="invalidParameters.length > 0"
            data-testid="error-invalid-parameters"
          >
            <li
              v-for="(parameter, index) in invalidParameters"
              :key="index"
            >
              {{ t('common.error_state.field') }} <b><code>{{ parameter.field }}</code></b>: {{ parameter.reason }}
            </li>
          </ul>
        </div>
      </template>
    </KEmptyState>
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
.error-block-header {
  max-width: 50%;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: $kui-space-40;
}

.error-block-title {
  display: flex;
  align-items: baseline;
  gap: $kui-space-40;
  text-align: left;
}

.error-block-message {
  text-align: left;
}

.badge-list {
  display: flex;
  gap: $kui-space-40;
  flex-wrap: wrap;
}
</style>

<style lang="scss">
.error-block-title p {
  margin-top: 0;
}
</style>
