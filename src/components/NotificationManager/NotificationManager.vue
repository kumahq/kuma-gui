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
      <template v-slot:alertMessage>
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
      <template v-slot:header-content>
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
          Some of these features are not enabled for
          <span class="text-xl tracking-wide"> "{{ selectedMesh }}"</span>
          mesh. Consider implementing them.

          <KBadge
            class="cursor-pointer"
            @click.native="changeMesh('all')"
          >
            &lsaquo; Back to all
          </KBadge>
        </div>
      </template>
      <template v-slot:body-content>
        <AllMeshesNotifications
          v-if="isAllMeshesView"
          @meshSelected="changeMesh($event)"
        />
        <SingleMeshNotifications v-else />
      </template>
      <template v-slot:footer-content>
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
    }),

    ...mapGetters({
      selectedMesh: 'getSelectedMesh',
      amountOfActions: 'notifications/amountOfActions',
      showOnboarding: 'onboarding/showOnboarding',
    }),

    isAllMeshesView() {
      return this.selectedMesh === 'all'
    },

    shouldRenderAlert() {
      return !this.alertClosed && !this.showOnboarding && this.amountOfActions > 0
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
      localStorage.setItem('selectedMesh', mesh)

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
