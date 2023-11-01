<template>
  <AppNavigator
    data-testid="control-planes-navigator"
  >
    <RouterLink
      :class="{ 'is-active': [$route.name].concat($route.matched.map(item => item.name)).some((item) => item === 'home') }"
      :to="{
        name: 'home',
      }"
    >
      Home
    </RouterLink>
  </AppNavigator>
</template>
<script lang="ts" setup>
import AppNavigator from '@/app/application/components/app-navigator/AppNavigator.vue'
</script>
