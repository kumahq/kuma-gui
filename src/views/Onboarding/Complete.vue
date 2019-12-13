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
          <p>
            <strong>Secure your traffic:</strong> by using the <a href="https://kuma.io/docs/latest/policies/#mutual-tls">mTLS policy</a>
          </p>
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
          <strong>Route your requests:</strong> by using the <a href="https://kuma.io/docs/latest/policies/#traffic-route">Traffic Route</a> policy
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
          <p><strong>Log your traffic</strong>, by using the <a href="https://kuma.io/docs/latest/policies/#traffic-log">Traffic Log</a> policy</p>
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
import { setItemToStorage, getItemFromStorage } from '@/Cache'

export default {
  name: 'OnboardingComplete',
  metaInfo: {
    title: 'Congratulations!'
  },
  computed: {
    hasUserBeenOnboarded () {
      return getItemFromStorage('kumaOnboardingComplete')
    },

    kumaVersion () {
      return this.$store.getters.getInfo
    }
  },
  methods: {
    completeOnboarding () {
      this.$store.dispatch('updateOnboardingStatus', true)

      setItemToStorage('kumaOnboardingComplete', true)

      this.$router.push({
        name: 'mesh-overview',
        params: {
          mesh: 'default'
        }
      })
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

.app-source-check__content {

  a {
    text-decoration: underline;
    color: var(--blue-link);
  }
}
</style>
