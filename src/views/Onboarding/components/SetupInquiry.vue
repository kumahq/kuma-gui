<template>
  <div class="setup-inquiry">
    <div class="xl">
      <p>
        It looks like you've already completed the setup process.
      </p>
      <p>
        Would you like to restart it?
      </p>
    </div>
    <p class="mt-4">
      <KButton
        appearance="primary"
        @click="restartOnboarding()"
      >
        Restart Setup
      </KButton>
    </p>
  </div>
</template>

<script>
import { setItemToStorage } from '@/Cache'

export default {
  metaInfo: {
    title: 'Setup Already Completed'
  },
  methods: {
    restartOnboarding () {
      this.$store.dispatch('updateOnboardingStatus', false)

      setItemToStorage('kumaOnboardingComplete', false)

      this.$router.push({
        name: 'setup-welcome'
      })
    }
  }
}
</script>

<style lang="scss">
.setup-inquiry {

}
</style>
