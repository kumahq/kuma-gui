<template>
  <KToggle
    v-slot="{ isToggled, toggle }"
  >
    <slot
      :expanded="isToggled.value"
      :toggle="toggle"
    />
  </KToggle>
</template>
<script lang="ts" setup>
import { KToggle } from '@kong/kongponents'
</script>
