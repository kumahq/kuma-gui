<template>
  <ServiceDetails
    class="component-frame"
    service-type="internal"
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
