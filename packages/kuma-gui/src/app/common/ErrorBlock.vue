<template>
  <div
    data-testid="error-block"
    class="error-block"
  >
    <KEmptyState
      v-if="!prompt"
    >
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
        <XBadge
          :appearance="props.appearance"
          data-testid="error-status"
        >
          {{ error.status }}
        </XBadge>

        <XBadge
          v-if="error.type"
          appearance="neutral"
          data-testid="error-type"
          max-width="auto"
        >
          type: {{ error.type }}
        </XBadge>

        <XBadge
          v-if="error.instance"
          appearance="neutral"
          data-testid="error-trace"
          max-width="auto"
        >
          trace: <TextWithCopyButton :text="error.instance" />
        </XBadge>
      </div>

      <div class="error-block-message mt-4">
        <slot v-if="$slots.default" />
        <template
          v-else-if="props.error instanceof ApiError"
        >
          <p>
            {{ props.error.message }}
          </p>
          <ul
            v-if="props.error.invalidParameters.length > 0"
            :data-testid="`error-invalid-parameters-${props.error.status}`"
          >
            <li
              v-for="parameter in props.error.invalidParameters"
              :key="parameter.field"
            >
              {{ t('common.error_state.field') }} <b><code>{{ parameter.field }}</code></b>: {{ parameter.reason }}
            </li>
          </ul>
        </template>
        <p v-else>
          {{ props.error.message }}
        </p>
      </div>
    </KEmptyState>
    <template
      v-else
    >
      <XAlert
        variant="danger"
      >
        <div
          class="error-block-message"
        >
          <slot v-if="$slots.default" />
          <template
            v-else-if="props.error instanceof ApiError"
          >
            <p>
              {{ t('common.error_state.api_error', { status: props.error.status, title: props.error.detail }) }}
            </p>
            <ul
              v-if="props.error.invalidParameters.length > 0"
              :data-testid="`error-invalid-parameters-${props.error.status}`"
            >
              <li
                v-for="parameter in props.error.invalidParameters"
                :key="parameter.field"
              >
                {{ t('common.error_state.field') }} <b><code>{{ parameter.field }}</code></b>: {{ parameter.reason }}
              </li>
            </ul>
          </template>
          <p v-else>
            {{ error.message }}
          </p>
        </div>
      </XAlert>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_DANGER } from '@kong/design-tokens'
import { DangerIcon } from '@kong/icons'
import { inject } from 'vue'

import { useI18n } from '@/app/application'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { ApiError } from '@/app/kuma/services/kuma-api/ApiError'

const { t } = useI18n()
const prompt = inject('x-prompt', undefined)

const props = withDefaults(defineProps<{
  error: Error
  appearance?: 'warning' | 'danger'
}>(), {
  appearance: 'warning',
})
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
