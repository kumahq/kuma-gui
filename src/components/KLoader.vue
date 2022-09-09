<template>
  <div class="loading-container">
    <img src="@/assets/images/kuma-loader-v1.gif">
    <div class="progress">
      <div
        :style="{ width: `${progress}%` }"
        class="progress-bar"
        role="progressbar"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      progress: 10,
    }
  },

  mounted() {
    this.timer = setInterval(() => {
      if (this.progress >= 100) {
        clearInterval(this.timer)
        this.progress = 100
      }

      this.progress = Math.min(this.progress + Math.ceil(Math.random(10) * 30), 100)
    }, 150)
  },

  unmounted() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  max-width: 350px;
  align-items: center;
  flex-direction: column;

  .progress {
    margin-top: 1rem;
    width: 130%;
    background-color: #e6e6e6;

    .progress-bar {
      height: 5px;
      background-color: var(--LoaderProgressBarBG);
    }
  }
}
</style>
