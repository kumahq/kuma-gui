<template>
  <h2>
    <RouterLink
      :to="props.linkTo"
    >
      <RouteTitle
        :title="props.title"
      />
    </RouterLink>
  </h2>
</template>

<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router'

const props = defineProps<{
  title: string
  linkTo: RouterLinkProps['to']
}>()
</script>

<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-circles-ext.svg?inline') !important;
}
</style>
