<template>
  <div class="screen">
    <div class="welcome-container">
      <div class="content">
        <h1 class="welcome-title">
          Welcome to {{ productName }}
        </h1>
        <p class="welcome-description">
          Congratulations on downloading {{ productName }}! You are just a <strong>few minutes</strong> away from getting your service mesh fully online.
        </p>

        <p class="welcome-description">
          We have automatically detected that you are running on <strong>{{ enviromentFormatted }}</strong>.
        </p>

        <h2 class="welcome-detected">
          Let's get started:
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
      <div class="welcome-navigation">
        <OnboardingNavigation next-step="onboarding-deployment-types" />
      </div>
    </div>
    <WelcomeAnimationSvg :longer="multicluster" />
  </div>
</template>

<script>
import { PRODUCT_NAME } from '@/consts'
import { mapGetters } from 'vuex'
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
      multicluster: 'config/getMulticlusterStatus',
    }),
    enviromentFormatted() {
      return this.environment.charAt(0).toUpperCase() + this.environment.slice(1)
    },
    multizoneItems() {
      const multizoneItems = []

      if (this.multicluster) {
        multizoneItems.push({
          name: 'Add zones',
          status: false,
        })
      }

      return multizoneItems
    },
    statuses() {
      return [
        {
          name: `Run ${this.productName} control plane`,
          status: true,
        },
        {
          name: 'Learn about deployments',
          status: false,
        },
        {
          name: 'Learn about configuration storage',
          status: false,
        },
        ...this.multizoneItems,
        {
          name: 'Create the mesh',
          status: false,
        },
        {
          name: 'Add services',
          status: false,
        },
        {
          name: 'Go to the dashboard',
          status: false,
        },
      ]
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

  @media screen and (min-width: 1700px) and (max-width: 1850px) {
    top: 12.5vw;
  }
}

.content {
  @media screen and (min-width: 1700px) {
    min-height: 23vw;
  }
}

.welcome-title {
  @apply text-5xl font-bold mb-3;

  background: linear-gradient(to right, var(--OnboardingTitle));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-description {
  @apply text-base mb-4;

  @media screen and (max-width: 1699px) {
    @apply mb-2;
  }
}

.welcome-detected {
  @apply text-2xl mb-4 font-bold;

  @media screen and (max-width: 1699px) {
    @apply text-xl mb-3;
  }
}

.welcome-navigation {
  @apply relative;

  top: -5px;

  @media screen and (min-width: 1700px) {
    top: -20px;
  }

  @media screen and (min-width: 1750px) {
    top: -10px;
  }

  @media screen and (min-width: 1800px) {
    top: 0;
  }

  @media screen and (min-width: 1850px) {
    top: -10px;
  }

  @media screen and (min-width: 1900px) {
    top: 0px;
  }

  @media screen and (min-width: 1950px) {
    top: 10px;
  }

  @media screen and (min-width: 2050px) {
    top: 20px;
  }
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

@keyframes show {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
