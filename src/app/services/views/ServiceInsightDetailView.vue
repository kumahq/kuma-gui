<template>
  <ServiceDetails
    type="ServiceInsight"
    :name="route.params.service"
    :mesh="route.params.mesh"
  />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import ServiceDetails from '../components/ServiceDetails.vue'
import { storeKey } from '@/store/store'

const route = useRoute()
const store = useStore(storeKey)

store.dispatch('updatePageTitle', route.params.service)
</script>
