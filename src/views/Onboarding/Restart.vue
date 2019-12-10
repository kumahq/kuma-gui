<template>
  <div class="setup-restart">
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
        :to="{ name: 'setup-welcome' }"
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
  name: 'OnboardingRestart',
  metaInfo: {
    title: 'Setup Already Completed'
  },
  methods: {
    restartOnboarding () {
      this.$store.dispatch('updateOnboardingStatus', false)

      setItemToStorage('kumaOnboardingComplete', false)

      // this.$router.push({
      //   name: 'setup-welcome'
      // })
    }
  }
}
</script>
