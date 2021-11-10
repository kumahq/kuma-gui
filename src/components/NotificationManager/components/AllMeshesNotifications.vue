<template>
  <div
    v-if="hasMeshesWithAction"
    class="py-4"
  >
    <h3 class="font-bold mb-4">
      Meshes
    </h3>
    <p>
      Check the following meshes for suggestions to adjust the configuration
    </p>
    <div class="pt-4">
      <span
        v-for="(value, name) in meshNotificationItemMapWithAction"
        :key="name"
        class="relative"
      >
        <KBadge
          class="ml-2 cursor-pointer transform hover:scale-110"
          @click.native="meshSelected(name)"
        >
          {{ name }}
        </KBadge>
        <span class="notification-amount">{{ calculateActions(value) }}</span>
      </span>
    </div>
  </div>
  <div v-else>
    Looks like none of your meshes are missing any features. Well done!
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AllMeshesNotifications',
  components: {},
  computed: {
    ...mapGetters({
      meshNotificationItemMapWithAction: 'notifications/meshNotificationItemMapWithAction',
    }),
  },
  methods: {
    meshSelected(name) {
      this.$emit('meshSelected', name)
    },
    hasMeshesWithAction() {
      return Object.keys(this.meshNotificationItemMapWithAction).length > 0
    },
    calculateActions(meshActions) {
      const allActions = Object.values(meshActions)
      const availableActions = allActions.filter(Boolean)

      return allActions.length - availableActions.length
    },
  },
}
</script>
