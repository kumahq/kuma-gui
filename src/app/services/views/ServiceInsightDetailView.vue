<template>
  <ServiceDetails
    class="service-details component-frame"
    type="ServiceInsight"
    :name="(route.params.service as string)"
    :mesh="(route.params.mesh as string)"
  />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

import ServiceDetails from '../components/ServiceDetails.vue'
import { useStore } from '@/store/store'

const route = useRoute()
const store = useStore()

store.dispatch('updatePageTitle', route.params.service)
</script>

<style lang="scss" scoped>
.service-details {
  padding: var(--spacing-md);
}
</style>
