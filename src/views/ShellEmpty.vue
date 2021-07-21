<template>
  <div
    class="main-content-container"
  >
    <div class="main-content">
      <transition
        mode="out-in"
        name="fade"
      >
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShellEmpty'
}
</script>
