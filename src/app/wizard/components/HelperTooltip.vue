<template>
  <KPop
    class="help-icon"
    trigger="hover"
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

<style lang="scss" scoped>
.help-icon {
  --size: 22px;

  display: inline-block;
  margin: 0 8px;
  width: var(--size);
}

.help-icon a {
  display: inline-block;
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  border-radius: 100%;
  color: var(--white);
  text-decoration: none;
  text-align: center;
  font-size: 12px;
  background-color: var(--grey-500);
  cursor: pointer;
}
</style>
