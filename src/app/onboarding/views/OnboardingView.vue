<template>
  <RouteView
    name="onboarding"
  >
    <AppView>
      <router-view
        v-slot="{ Component }"
      >
        <component
          :is="Component"
          v-if="route.name === 'onboarding-add-services'"
          :mode="mode"
          @change="(val: Mode) => {
            mode = val
          }"
        />
        <component
          :is="Component"
          v-else
        />
      </router-view>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
type Mode = 'demo' | 'manually'
const route = useRoute()
const mode = ref<Mode>('demo')
</script>
