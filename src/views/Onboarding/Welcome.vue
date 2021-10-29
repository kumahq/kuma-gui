<template>
  <div class="screen">
    <div class="welcome-container">
      <div class="content">
        <h1 class="welcome-title">
          Welcome to {{ productName }}
        </h1>
        <p class="welcome-description">
          Congratulations for downloading
          {{ productName }} — <strong>setup takes about 4 minutes</strong> to get your service mesh fully online.
        </p>
        <h2 class="welcome-detected">
          We’ve automatically detected...
        </h2>

        <ul>
          <ItemStatus
            v-for="item in statuses"
            :key="item.name"
            :name="item.name"
            :status="item.status"
          />
        </ul>
      </div>
      <OnboardingNavigation
        next-step="onboarding-deployment-types"
        next-step-title="Step 1"
      >
        <KButton
          class="skip-button"
          appearance="btn-link"
          size="small"
          @click.native="skipOnboarding"
        >
          Skip Setup
        </KButton>
      </OnboardingNavigation>
    </div>
    <WelcomeAnimationSvg />
  </div>
</template>

<script>
import { PRODUCT_NAME } from '@/consts'
import { mapActions, mapGetters } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import ItemStatus from './components/ItemStatus'
import WelcomeAnimationSvg from './components/WelcomeAnimationSvg'

export default {
  name: 'Welcome',
  components: {
    ItemStatus,
    OnboardingNavigation,
    WelcomeAnimationSvg,
  },

  metaInfo() {
    return {
      title: `Welcome to ${PRODUCT_NAME}!`,
    }
  },
  data() {
    return {
      productName: PRODUCT_NAME,
    }
  },
  computed: {
    ...mapGetters({
      environment: 'config/getEnvironment',
      getMulticlusterStatus: 'config/getMulticlusterStatus',
    }),
    statuses() {
      return [
        {
          name: 'Chose Deployment Type',
          status: false,
        },
        {
          name: 'Choose Backend Type',
          status: false,
        },
        {
          name: this.environment.charAt(0).toUpperCase() + this.environment.slice(1),
          status: true,
        },
        {
          name: this.getMulticlusterStatus ? ' Multi-Zone ' : ' Standalone',
          status: true,
        },
        {
          name: 'Populate a Mesh',
          status: false,
        },
      ]
    },
  },
  methods: {
    ...mapActions('onboarding', ['completeOnboarding']),
    skipOnboarding() {
      this.completeOnboarding()
      this.$router.push({
        name: 'global-overview',
        params: {
          mesh: 'all',
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.welcome-container {
  @apply w-112 absolute left-0 right-0 mx-auto mt-16 opacity-0 z-10;

  top: 14.5vw;
  animation: show 1.5s 7.2s 1 forwards;

  @media screen and (max-width: 1699px) {
    @apply mt-10;

    top: 50%;
    transform: translateY(-50%);
  }
}

.content {
  @media screen and (min-width: 1700px) {
    min-height: 23vw;
  }
}

.welcome-title {
  @apply text-5xl font-bold mb-6;

  background: linear-gradient(to right, var(--OnboardingTitle));
  background-clip: text;
  -webkit-text-fill-color: transparent;

  @media screen and (max-width: 1699px) {
    @apply mb-3;
  }
}

.welcome-description {
  @apply text-lg mb-12;

  @media screen and (max-width: 1699px) {
    @apply mb-5;
  }
}

.welcome-detected {
  @apply text-2xl mb-8 font-bold;
}

.screen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -1;
  overflow: scroll;
  color: var(--kuma-purple-1);
}

.skip-button {
  @apply font-medium mr-8;

  --KButtonBtnLink: var(--OnboardingSkipSetupButton);
}

@keyframes show {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
