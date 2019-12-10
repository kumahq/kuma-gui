<template>
  <div class="welcome welcome__step-1">
    <p class="lg">
      You have successfully configured Kuma with the first Dataplanes,
      and therefore Services. You can now:
    </p>

    <div class="app-checkmarks">
      <div class="flex items-center">
        <div class="px-2">
          <img
            src="@/assets/images/icon-checkmark.svg?external"
            alt="Checkmark Icon"
          >
        </div>
        <div class="app-source-check__content px-2">
          <p>Secure your traffic</p>
        </div>
      </div>
      <div class="flex items-center">
        <div class="px-2">
          <img
            src="@/assets/images/icon-checkmark.svg?external"
            alt="Checkmark Icon"
          >
        </div>
        <div class="app-source-check__content px-2">
          <p>Observe your traffic</p>
        </div>
      </div>
      <div class="flex items-center">
        <div class="px-2">
          <img
            src="@/assets/images/icon-checkmark.svg?external"
            alt="Checkmark Icon"
          >
        </div>
        <div class="app-source-check__content px-2">
          <p>Expose your traffic</p>
        </div>
      </div>
    </div>

    <div class="app-benefits">
      <KButton
        appearance="primary"
        @click="completeOnboarding()"
      >
        See the Dashboard
      </KButton>
    </div>
  </div>
</template>

<script>
import { setItemToStorage } from '@/Cache'

export default {
  name: 'OnboardingComplete',
  metaInfo: {
    title: 'Congratulations!'
  },
  methods: {
    completeOnboarding () {
      this.$store.dispatch('updateOnboardingStatus', true)

      setItemToStorage('kumaOnboardingComplete', true)

      this.$router.push({
        name: 'global-overview'
      })

      console.log('onboarding complete!')
    }
  }
}
</script>

<style lang="scss">
.app-checkmarks {
  margin: var(--spacing-xl) auto;

  > * {
    background-color: var(--blue-lighter);
    padding: 18px;
    border-radius: 4px;
    margin-top: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }
}
</style>
