<template>
  <div>
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
import { KButton, KModal } from '@kong/kongponents'
import { computed } from 'vue'

import SingleMeshNotifications from './SingleMeshNotifications.vue'
import { useStore } from '@/store/store'

const store = useStore()

const hasAnyAction = computed(() => {
  if (store.state.selectedMesh) {
    return store.getters['notifications/meshNotificationItemMapWithAction'][store.state.selectedMesh]
  } else {
    return false
  }
})

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
