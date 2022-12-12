<template>
  <div class="full-screen">
    <div class="loading-container">
      <img src="@/assets/images/kuma-loader-v1.gif">

      <div class="progress">
        <div
          :style="{ width: `${progress}%` }"
          class="progress-bar"
          role="progressbar"
          data-testid="app-progress-bar"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

let timer: number
const progress = ref<number>(10)

onMounted(function () {
  timer = window.setInterval(() => {
    if (progress.value >= 100) {
      window.clearInterval(timer)
      progress.value = 100
    }

    progress.value = Math.min(progress.value + Math.ceil(Math.random() * 30), 100)
  }, 150)
})

onUnmounted(function () {
  window.clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.full-screen {
  background: var(--white);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-container {
  display: flex;
  max-width: 350px;
  align-items: center;
  flex-direction: column;

  .progress {
    margin-top: 1rem;
    width: 130%;
    background-color: var(--grey-300);

    .progress-bar {
      height: 5px;
      background-color: var(--blue-400);
    }
  }
}
</style>
