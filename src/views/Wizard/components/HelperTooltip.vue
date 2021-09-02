<template>
  <KPop
    trigger="hover"
    class="help-icon"
  >
    <a>?</a>
    <template v-slot:content>
      <div>
        <slot />
      </div>
    </template>
  </KPop>
</template>

<script>
export default {}
</script>

<style>
</style>
