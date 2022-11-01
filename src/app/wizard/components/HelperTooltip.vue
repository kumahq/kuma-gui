<template>
  <KPop
    trigger="hover"
    class="help-icon"
  >
    <a>?</a>

    <template #content>
      <div>
        <slot />
      </div>
    </template>
  </KPop>
</template>

<script lang="ts" setup>
import { KPop } from '@kong/kongponents'
</script>
