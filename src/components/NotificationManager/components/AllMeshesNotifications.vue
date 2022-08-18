<template>
  <div>
    <div class="py-4">
      <h3 class="font-bold mb-4">
        Meshes
      </h3>
      <div v-if="hasMeshesWithAction">
        <p>
          Check the following meshes for suggestions to adjust the configuration
        </p>
        <div class="pt-4 flex space-x-4">
          <span
            v-for="(value, name) in meshNotificationItemMapWithAction"
            :key="name"
            class="relative d-inline-block"
          >
            <KBadge
              class="cursor-pointer transform hover:scale-110"
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
    </div>
    <div class="py-4">
      <h3 class="font-bold mb-4">
        Enterprise
      </h3>
      <p>
        Kuma’s ecosystem has created enterprise offerings to do more with the product, including advanced integrations and support.
      </p>

      <KButton
        class="enterprise-button"
        appearance="primary"
        target="_blank"
        :to="url"
      >
        <KIcon
          icon="organizations"
          color="white"
          size="24"
        />

        Kuma Enterprise Offerings
      </KButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AllMeshesNotifications',
  data() {
    return {
      url: `https://kuma.io/enterprise/${process.env.VUE_APP_UTM}`,
    }
  },
  computed: {
    ...mapGetters({
      meshNotificationItemMapWithAction: 'notifications/meshNotificationItemMapWithAction',
    }),
    hasMeshesWithAction() {
      return Object.keys(this.meshNotificationItemMapWithAction).length > 0
    },
  },
  methods: {
    meshSelected(name) {
      this.$emit('meshSelected', name)
    },
    calculateActions(meshActions) {
      const allActions = Object.values(meshActions)
      const availableActions = allActions.filter(Boolean)

      return allActions.length - availableActions.length
    },
  },
}
</script>

<style lang="scss" scoped>
.enterprise-button {
  @apply mt-4 shadow-lg;
  --KButtonPrimaryBase: #19a654;
  --KButtonPrimaryHover: #19a654;
  --KButtonPrimaryActive: #19a654;
}
</style>
