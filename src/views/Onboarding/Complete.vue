<template>
  <div class="welcome welcome__step-1">
    <p
      v-if="title"
      class="type-lg"
    >
      You have successfully configured {{ title }} with the first data plane proxies,
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
            <strong>Secure your traffic:</strong> by using the <a :href="`https://kuma.io/docs/${runningVersion}/policies/#mutual-tls${process.env.VUE_APP_UTM}`">mTLS policy</a>
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
          <strong>Route your requests:</strong> by using the <a :href="`https://kuma.io/docs/${runningVersion}/policies/#traffic-route${process.env.VUE_APP_UTM}`">Traffic Route</a> policy
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
          <p><strong>Log your traffic</strong>, by using the <a :href="`https://kuma.io/docs/${runningVersion}/policies/#traffic-log${process.env.VUE_APP_UTM}`">Traffic Log</a> policy</p>
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
          <p><strong>Trace your traffic</strong>, by using the <a :href="`https://kuma.io/docs/${runningVersion}/policies/#traffic-trace${process.env.VUE_APP_UTM}`">Traffic Trace</a> policy</p>
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
          <p><strong>Inject Fault</strong>, by using the <a :href="`https://kuma.io/docs/${runningVersion}/policies/#fault-injections${process.env.VUE_APP_UTM}`">Fault Injection</a> policy</p>
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
          <p><strong>And you can do <a :href="`https://kuma.io/docs/${runningVersion}/policies/${process.env.VUE_APP_UTM}`">much more</a>!</strong></p>
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
import { mapGetters } from 'vuex'
import { setItemToStorage, getItemFromStorage } from '@/Cache'

export default {
  name: 'OnboardingComplete',
  metaInfo: {
    title: 'Congratulations!'
  },
  computed: {
    ...mapGetters({
      title: 'getTagline'
    }),
    hasUserBeenOnboarded () {
      return getItemFromStorage('kumaOnboardingComplete')
    },

    runningVersion () {
      const storedVersion = this.$store.getters.getVersion
      const ver = (storedVersion !== null) ? storedVersion : 'latest'

      return ver
    }
  },
  methods: {
    completeOnboarding () {
      this.$store.dispatch('updateOnboardingStatus', true)

      setItemToStorage('kumaOnboardingComplete', true)

      this.$router.push({
        name: 'global-overview',
        params: {
          mesh: 'all',
          expandSidebar: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-checkmarks {
  margin: var(--spacing-xl) auto;

  > * {
    background-color: var(--blue-200);
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
