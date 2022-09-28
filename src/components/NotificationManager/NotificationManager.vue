<template>
  <div>
    <KAlert
      v-if="shouldRenderAlert"
      class="mb-4"
      appearance="info"
      dismiss-type="icon"
      data-testid="notification-info"
      @closed="closeAlert"
    >
      <template #alertMessage>
        <div class="mr-4">
          <span class="mr-2">
            <strong>ProTip:</strong>

            You might want to adjust your {{ isAllMeshesView ? 'meshes' : 'mesh' }} configuration
          </span>

          <KButton
            appearance="outline"
            data-testid="open-modal-button"
            @click="openModal"
          >
            Check your {{ isAllMeshesView ? 'meshes' : 'mesh' }}!
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
        <div
          v-if="isAllMeshesView"
          class="flex items-center"
        >
          <KIcon
            color="var(--yellow-300)"
            icon="notificationBell"
            size="24"
            class="mr-2"
          />

          Notifications
        </div>

        <div v-else>
          <div>
            <span v-if="hasAnyAction">
              Some of these features are not enabled for <span class="text-xl tracking-wide">"{{ store.state.selectedMesh }}"</span> mesh. Consider implementing them.
            </span>

            <span v-else> Looks like
              <span class="text-xl tracking-wide">"{{ store.state.selectedMesh }}"</span> isn't missing any features. Well done!
            </span>
          </div>

          <KButton
            class="mt-4"
            appearance="outline"
            @click="changeMesh('all')"
          >
            ‹ Back to all
          </KButton>
        </div>
      </template>

      <template #body-content>
        <AllMeshesNotifications
          v-if="isAllMeshesView"
          @mesh-selected="changeMesh"
        />

        <SingleMeshNotifications v-else />
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KAlert, KButton, KIcon, KModal } from '@kong/kongponents'

import { useStore } from '@/store/store'
import AllMeshesNotifications from './components/AllMeshesNotifications.vue'
import SingleMeshNotifications from './components/SingleMeshNotifications.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const alertClosed = ref(false)

const isAllMeshesView = computed(() => store.state.selectedMesh === 'all')

const shouldRenderAlert = computed(() => !alertClosed.value && !store.getters['onboarding/showOnboarding'] && store.getters['notifications/amountOfActions'] > 0)

const hasAnyAction = computed(() => store.getters['notifications/meshNotificationItemMapWithAction'][store.state.selectedMesh])

function closeAlert(): void {
  alertClosed.value = true
}

function changeMesh(mesh: string): void {
  store.dispatch('updateSelectedMesh', mesh)

  if (route.name) {
    router.push({
      name: route.name,
      params: { mesh },
    })
  }
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
  @apply mx-4;

  --KModalMaxWidth: 800px;
}
</style>
