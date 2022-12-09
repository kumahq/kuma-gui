<template>
  <button
    class="notification-icon cursor-pointer"
    type="button"
    @click="openModal"
  >
    <KIcon
      icon="notificationBell"
      color="var(--yellow-300)"
      hide-title
    />

    <span
      v-if="amountOfActions > 0"
      data-testid="notification-amount"
      class="notification-icon__amount"
    >{{ amountOfActions }}</span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { KIcon } from '@kong/kongponents'

import { useStore } from '@/store/store'

const store = useStore()

const amountOfActions = computed(() => store.getters['notifications/amountOfActions'])

function openModal() {
  store.dispatch('notifications/openModal')
}
</script>

<style lang="scss" scoped>
.notification-icon {
  --amount-offset: 8px;

  position: relative;
  padding-right: var(--amount-offset);
  display: inline-flex;
  align-items: center;
}

.notification-icon__amount {
  position: absolute;
  top: calc(-1 * var(--amount-offset));
  right: 0;
  height: 1.25rem;
  width: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--white);
  border-radius: 50%;
  background-color: var(--yellow-300);
}
</style>
