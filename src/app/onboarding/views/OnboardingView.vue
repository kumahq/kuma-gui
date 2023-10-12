<template>
  <RouteView
    name="onboarding"
    :attrs="{
      class: 'no-navigation'
    }"
  >
    <AppView>
      <RouterView
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
      </RouterView>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

type Mode = 'demo' | 'manually'
const route = useRoute()
const mode = ref<Mode>('demo')
</script>
