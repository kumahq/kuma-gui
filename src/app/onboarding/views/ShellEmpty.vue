<template>
  <router-view v-slot="{ Component }">
    <transition
      mode="out-in"
      name="fade"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {
  name: 'ShellEmpty',
}
</script>
