<template>
  <div
    class="relative cursor-pointer"
    @click="openModal"
  >
    <KIcon
      color="var(--yellow-300)"
      icon="notificationBell"
      size="16"
      class="ml-1"
    />
    <span
      v-if="amountOfActions > 0"
      data-testid="notification-amount"
      class="notification-amount"
    >{{ amountOfActions }}</span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'NotificationIcon',
  computed: {
    ...mapGetters({
      amountOfActions: 'notifications/amountOfActions',
    }),
  },
  methods: {
    ...mapActions({
      openModal: 'notifications/openModal',
    }),
  },
}
</script>

<style lang="scss" scoped>
.notification-amount {
  @apply absolute text-xs text-white bg-yellow-300 rounded-full w-4 h-4 flex justify-center items-center;

  top: -8px;
  right: -8px;
}
</style>
