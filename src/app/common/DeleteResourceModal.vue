<template>
  <KPrompt
    :action-button-text="props.actionButtonText"
    :confirmation-text="props.confirmationText"
    :is-visible="props.isVisible"
    :title="props.title"
    type="danger"
    @canceled="emit('cancel')"
    @proceed="deleteResource"
  >
    <template #body-content>
      <slot name="body-content" />

      <KAlert
        v-if="error !== null"
        class="mt-4"
        appearance="danger"
        is-dismissible
      >
        <template #alertMessage>
          <template v-if="(error instanceof ApiError)">
            <p>{{ t('common.error_state.api_error', { status: error.status, title: error.detail }) }}</p>

            <ul
              v-if="error.invalidParameters.length > 0"
              :data-testid="`error-${error.status}`"
            >
              <li
                v-for="(parameter, index) in error.invalidParameters"
                :key="index"
              >
                <b><code>{{ parameter.field }}</code></b>: {{ parameter.reason }}
              </li>
            </ul>
          </template>

          <template v-else>
            <p>{{ t('common.error_state.default_error') }}</p>
          </template>
        </template>
      </KAlert>
    </template>
  </KPrompt>
</template>

<script lang="ts" setup>
import { KAlert, KPrompt } from '@kong/kongponents'
import { PropType, ref } from 'vue'

import { ApiError } from '@/services/kuma-api/ApiError'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps({
  actionButtonText: {
    type: String,
    required: false,
    default: 'Yes, delete',
  },

  confirmationText: {
    type: String,
    required: false,
    default: '',
  },

  /**
   * Delete function to call once the modal dialog was confirmed.
   *
   * Will be awaited. If the promise resolved, the “delete” event is emitted; if the promise rejects, the internal error state will be triggered.
   */
  deleteFunction: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },

  isVisible: {
    type: Boolean,
    required: true,
  },

  title: {
    type: String,
    required: false,
    default: 'Delete',
  },
})

const emit = defineEmits<{
  (event: 'cancel'): void
  (event: 'delete'): void
}>()

const error = ref<Error | null>(null)

async function deleteResource() {
  error.value = null

  try {
    await props.deleteFunction()
    emit('delete')
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  }
}
</script>
