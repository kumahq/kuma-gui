<template>
  <div>
    <KAlert
      v-if="isShowingAlert"
      class="mb-4"
      appearance="info"
      dismiss-type="icon"
      data-testid="notification-info"
      @closed="closeAlert"
    >
      <template #alertMessage>
        <div class="mr-4">
          <span class="mr-2">
            <strong>Pro tip:</strong>

            You might want to adjust your mesh configuration
          </span>

          <KButton
            appearance="outline"
            data-testid="open-modal-button"
            @click="openModal"
          >
            Check your mesh!
          </KButton>
        </div>
      </template>
    </KAlert>

    <KModal
      class="modal"
      :is-visible="store.state.notifications.isOpen"
      title="Notifications"
      text-align="left"
      data-testid="notification-modal"
    >
      <template #header-content>
        <div>
          <div>
            <span v-if="hasAnyAction">
              Some of these features are not enabled for <span class="text-xl tracking-wide">"{{ store.state.selectedMesh }}"</span> mesh. Consider implementing them.
            </span>

            <span v-else>
              Looks like <span class="text-xl tracking-wide">"{{ store.state.selectedMesh }}"</span> isn't missing any features. Well done!
            </span>
          </div>
        </div>
      </template>

      <template #body-content>
        <SingleMeshNotifications />
      </template>

      <template #footer-content>
        <KButton
          appearance="outline"
          data-testid="close-modal-button"
          @click="closeModal"
        >
          Close
        </KButton>
      </template>
    </KModal>
  </div>
</template>

<script lang="ts" setup>
import { KAlert, KButton, KModal } from '@kong/kongponents'
import { computed, onMounted, ref } from 'vue'

import SingleMeshNotifications from './SingleMeshNotifications.vue'
import { useStore } from '@/store/store'
import { ClientStorage } from '@/utilities/ClientStorage'

const store = useStore()

const isShowingAlert = ref(true)

const hasAnyAction = computed(() => {
  if (store.state.selectedMesh) {
    return store.getters['notifications/meshNotificationItemMapWithAction'][store.state.selectedMesh]
  } else {
    return false
  }
})

onMounted(function () {
  const hideCheckMeshAlert = ClientStorage.get('hideCheckMeshAlert')

  isShowingAlert.value = hideCheckMeshAlert !== 'yes'
})

function closeAlert(): void {
  isShowingAlert.value = false

  ClientStorage.set('hideCheckMeshAlert', 'yes')
}

function openModal(): void {
  store.dispatch('notifications/openModal')
}

function closeModal(): void {
  store.dispatch('notifications/closeModal')
}
</script>

<style lang="scss" scoped>
.modal {
  --KModalMaxWidth: 800px;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
