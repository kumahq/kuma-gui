<template>
  <div
    data-testid="error-block"
    class="error-block"
  >
    <KEmptyState>
      <template #icon>
        <DangerIcon
          v-if="props.appearance === 'danger'"
          :color="KUI_COLOR_TEXT_DANGER"
        />
        <XIcon
          v-else
          name="warning"
        />
      </template>

      <template #title>
        <slot name="title">
          {{ error instanceof ApiError && error.detail ? error.detail : t('common.error_state.title') }}
        </slot>
      </template>

      <div
        v-if="(error instanceof ApiError)"
        class="badge-list"
      >
        <KBadge
          :appearance="props.appearance"
          data-testid="error-status"
        >
          {{ error.status }}
        </KBadge>

        <KBadge
          v-if="error.type"
          appearance="neutral"
          data-testid="error-type"
          max-width="auto"
        >
          type: {{ error.type }}
        </KBadge>

        <KBadge
          v-if="error.instance"
          appearance="neutral"
          data-testid="error-trace"
          max-width="auto"
        >
          trace: <TextWithCopyButton :text="error.instance" />
        </KBadge>
      </div>

      <div class="error-block-message mt-4">
        <slot v-if="$slots.default" />

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
    </KEmptyState>
  </div>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_DANGER } from '@kong/design-tokens'
import { DangerIcon } from '@kong/icons'
import { computed } from 'vue'

import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { ApiError } from '@/app/kuma/services/kuma-api/ApiError'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  error: Error
  appearance?: 'warning' | 'danger'
}>(), {
  appearance: 'warning',
})

const invalidParameters = computed(() => props.error instanceof ApiError ? props.error.invalidParameters : [])
</script>

<style lang="scss" scoped>
.error-block-message {
  text-align: left;
}

.badge-list {
  display: flex;
  gap: $kui-space-40;
  flex-wrap: wrap;
}
</style>
