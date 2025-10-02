<template>
  <div
    data-testid="error-block"
    class="error-block"
  >
    <KEmptyState
      v-if="!prompt && !modal"
    >
      <template #icon>
        <XIcon
          :name="props.appearance"
          :color="props.appearance === 'danger' ? KUI_COLOR_TEXT_DANGER : undefined"
        />
      </template>

      <template #title>
        <slot name="title">
          {{ props.error.title || t('common.error_state.title') }}
        </slot>
      </template>

      <XLayout class="detail">
        <slot name="message">
          <XDl variant="x-stack">
            <div>
              <dt>{{ t('http.api.property.error') }}</dt>
              <dd>{{ props.error.detail || t('common.error_state.message') }}</dd>
            </div>
          </XDl>
        
          <XDl variant="x-stack">
            <div v-if="props.error.status">
              <dt>{{ t('http.api.property.status') }}</dt>
              <dd>
                <XBadge appearance="neutral">
                  {{ props.error.status }}
                </XBadge>
              </dd>
            </div>
            <div v-if="props.error.type">
              <dt>{{ t('http.api.property.type') }}</dt>
              <dd>
                <XBadge appearance="neutral">
                  {{ props.error.type }}
                </XBadge>
              </dd>
            </div>
            <div v-if="props.error.instance">
              <dt>{{ t('http.api.property.trace') }}</dt>
              <dd>
                <XBadge appearance="neutral">
                  {{ props.error.instance }}
                </XBadge>
              </dd>
            </div>
          </XDl>
        </slot>
      </XLayout>
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
          <slot>
            <p>
              {{ t('common.error_state.api_error', { status: props.error.status.toString(), title: props.error.detail }) }}
            </p>
            <ul
              v-if="props.error.invalid_parameters?.length"
              :data-testid="`error-invalid-parameters-${props.error.status}`"
            >
              <li
                v-for="parameter in props.error.invalid_parameters"
                :key="parameter.field"
              >
                {{ t('common.error_state.field') }} <b><code>{{ parameter.field }}</code></b>: {{ parameter.reason }}
              </li>
            </ul>
          </slot>
        </div>
      </XAlert>
    </template>
  </div>
</template>

<script lang="ts" setup generic="T extends { type: string, status: number, title: string, detail: string, instance: string, invalid_parameters?: { field: string, reason: string, source: 'body' | 'header', rule?: string }[] }">
import { KUI_COLOR_TEXT_DANGER } from '@kong/design-tokens'
import { inject } from 'vue'

import { useI18n } from '../../'

const props = withDefaults(defineProps<{
  error: T
  appearance?: 'warning' | 'danger'
}>(), {
  appearance: 'warning',
})

const { t } = useI18n()
const prompt = inject('x-prompt', undefined)
const modal = inject('x-modal', undefined)
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  flex-flow: column;
  align-items: center;
}
.error-block-message {
  text-align: left;
}
</style>
