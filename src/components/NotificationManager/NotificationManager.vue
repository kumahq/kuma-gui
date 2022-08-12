<template>
  <div>
    <KAlert
      v-if="shouldRenderAlert"
      class="mb-4"
      appearance="info"
      is-dismissible
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
            appearance="outline-primary"
            @click="openModal"
          >
            Check your {{ isAllMeshesView ? 'meshes' : 'mesh' }}!
          </KButton>
        </div>
      </template>
    </KAlert>

    <KModal
      class="modal"
      :is-visible="isOpen"
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
          /> Notifications
        </div>
        <div v-else>
          <span v-if="hasAnyAction">
            Some of these features are not enabled for
            <span class="text-xl tracking-wide"> "{{ selectedMesh }}"</span>
            mesh. Consider implementing them.

          </span>
          <span v-else> Looks like
            <span class="text-xl tracking-wide"> "{{ selectedMesh }}"</span>
            isn't missing any features. Well done!
          </span>
          <KBadge
            class="cursor-pointer"
            role="button"
            @click.native="changeMesh('all')"
          >
            &lsaquo; Back to all
          </KBadge>
        </div>
      </template>
      <template #body-content>
        <AllMeshesNotifications
          v-if="isAllMeshesView"
          @meshSelected="changeMesh($event)"
        />
        <SingleMeshNotifications v-else />
      </template>
      <template #footer-content>
        <KButton
          appearance="secondary"
          @click="closeModal"
        >
          Close
        </KButton>
      </template>
    </KModal>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

import AllMeshesNotifications from './components/AllMeshesNotifications.vue'
import SingleMeshNotifications from './components/SingleMeshNotifications.vue'

export default {
  name: 'NotificationManager',
  components: {
    AllMeshesNotifications,
    SingleMeshNotifications,
  },
  data() {
    return {
      alertClosed: false,
    }
  },
  computed: {
    ...mapState({
      isOpen: (state) => state.notifications.isOpen,
      selectedMesh: (state) => state.selectedMesh,
    }),

    ...mapGetters({
      amountOfActions: 'notifications/amountOfActions',
      showOnboarding: 'onboarding/showOnboarding',
      meshNotificationItemMapWithAction: 'notifications/meshNotificationItemMapWithAction',
    }),

    isAllMeshesView() {
      return this.selectedMesh === 'all'
    },

    shouldRenderAlert() {
      return !this.alertClosed && !this.showOnboarding && this.amountOfActions > 0
    },

    hasAnyAction() {
      return this.meshNotificationItemMapWithAction[this.selectedMesh]
    },
  },
  methods: {
    ...mapActions({
      openModal: 'notifications/openModal',
      closeModal: 'notifications/closeModal',
      updateSelectedMesh: 'updateSelectedMesh',
    }),
    closeAlert() {
      this.alertClosed = true
    },

    changeMesh(mesh) {
      this.updateSelectedMesh(mesh)

      // explanation of hack https://github.com/vuejs/vue-router/issues/2872
      this.$router
        .push({
          params: {
            mesh,
          },
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  @apply mx-4;

  --KModalMaxWidth: 800px;
}
</style>
