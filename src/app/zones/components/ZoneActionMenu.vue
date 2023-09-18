<template>
  <div>
    <KDropdownMenu
      button-appearance="creation"
      :kpop-attributes="props.kpopAttributes"
      :label="t('zones.action_menu.toggle_button')"
      show-caret
      width="280"
    >
      <template #items>
        <KDropdownItem
          is-dangerous
          data-testid="delete-button"
          @click.prevent="toggleDeleteModal"
        >
          {{ t('zones.action_menu.delete_button') }}
        </KDropdownItem>
      </template>
    </KDropdownMenu>

    <DeleteResourceModal
      v-if="isDeleteModalOpen"
      :confirmation-text="props.zoneOverview.name"
      :delete-function="deleteZone"
      :is-visible="isDeleteModalOpen"
      modal-id="delete-zone-modal"
      :action-button-text="t('zones.delete.confirmModal.proceedText')"
      :title="t('zones.delete.confirmModal.title')"
      @cancel="toggleDeleteModal"
      @delete="navigateToListView"
    >
      <template #body-content>
        <p>{{ t('zones.delete.confirmModal.text1', { zoneName: props.zoneOverview.name }) }}</p>

        <p>{{ t('zones.delete.confirmModal.text2') }}</p>
      </template>

      <template #error>
        {{ t('zones.delete.confirmModal.errorText') }}
      </template>
    </DeleteResourceModal>
  </div>
</template>

<script lang="ts" setup>
import { KDropdownItem, KDropdownMenu } from '@kong/kongponents'
import { PropType, ref } from 'vue'
import { useRouter } from 'vue-router'

import DeleteResourceModal from '@/app/common/DeleteResourceModal.vue'
import type { ZoneOverview } from '@/types/index.d'
import { useI18n, useKumaApi } from '@/utilities'

const { t } = useI18n()
const kumaApi = useKumaApi()
const router = useRouter()

const props = defineProps({
  zoneOverview: {
    type: Object as PropType<ZoneOverview>,
    required: true,
  },

  kpopAttributes: {
    type: Object,
    default: () => ({
      placement: 'bottomEnd',
    }),
  },
})

const isDeleteModalOpen = ref(false)

function toggleDeleteModal() {
  isDeleteModalOpen.value = !isDeleteModalOpen.value
}

async function deleteZone() {
  // Intentionally not wrapped in a try-catch block so that the DeleteResourceModal can discover when the operation failed.
  await kumaApi.deleteZone({ name: props.zoneOverview.name })
}

function navigateToListView() {
  router.push({ name: 'zone-cp-list-view' })
}
</script>
