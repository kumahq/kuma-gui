<template>
  <AppNavigator
    v-icon-start="`zone-egress`"
    data-testid="zone-egresses-navigator"
    :active="active"
    label="ZoneEgresses"
    :to="{
      name: 'zone-egress-list-view',
    }"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppNavigator from '@/app/application/components/app-navigator/AppNavigator.vue'

const route = useRoute()
const active = computed(() => route.matched.some((item) => item.name === 'zone-egress-index-view'))
</script>
