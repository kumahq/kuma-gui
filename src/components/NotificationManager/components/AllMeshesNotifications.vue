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
              class="cursor-pointer hover:scale-110"
              @click="meshSelected(name)"
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

<script lang="ts" setup>
import { computed } from 'vue'
import { KBadge, KButton, KIcon } from '@kong/kongponents'

import { useStore } from '@/store/store'
import { MeshNotificationItem } from '@/store/modules/notifications/notifications.types'

const store = useStore()

const emit = defineEmits<{
  (event: 'mesh-selected', mesh: string): void
}>()

const url = `https://kuma.io/enterprise/${import.meta.env.VITE_UTM}`

const meshNotificationItemMapWithAction = computed<Record<string, MeshNotificationItem>>(() => store.getters['notifications/meshNotificationItemMapWithAction'])

const hasMeshesWithAction = computed(() => Object.keys(meshNotificationItemMapWithAction.value).length > 0)

function meshSelected(mesh: string) {
  emit('mesh-selected', mesh)
}

function calculateActions(notificationItem: MeshNotificationItem) {
  const allActions = Object.values(notificationItem)
  const availableActions = allActions.filter(Boolean)

  return allActions.length - availableActions.length
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
