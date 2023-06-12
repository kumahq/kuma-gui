<template>
  <KPrompt
    :action-button-text="props.actionButtonText"
    :confirmation-text="props.confirmationText"
    :is-visible="props.isVisible"
    :modal-id="props.modalId"
    :title="props.title"
    type="danger"
    data-testid="delete-resource-modal"
    @canceled="emit('cancel')"
    @proceed="deleteResource"
  >
    <template #body-content>
      <slot name="body-content" />

      <KAlert
        v-if="hasError"
        class="mt-4"
        appearance="danger"
        is-dismissible
      >
        <template #alertMessage>
          <slot name="error" />
        </template>
      </KAlert>
    </template>
  </KPrompt>
</template>

<script lang="ts" setup>
import { KAlert, KPrompt } from '@kong/kongponents'
import { PropType, ref } from 'vue'

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

  modalId: {
    type: String,
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

const hasError = ref(false)

async function deleteResource() {
  hasError.value = false

  try {
    await props.deleteFunction()
    emit('delete')
  } catch (err) {
    console.error(err)
    hasError.value = true
  }
}
</script>
