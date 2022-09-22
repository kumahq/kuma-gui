<template>
  <div
    v-if="loading"
    class="full-screen"
  >
    <KLoader />
  </div>

  <div
    v-else
    class="app"
  >
    <GlobalHeader />

    <div class="app-content-container">
      <ApiErrorMessage v-if="status !== 'OK'" />

      <AppSidebar class="app-sidebar" />

      <main
        class="app-main-content"
        :class="{
          'app-main-content--wide': isWideContent,
          'app-main-content--narrow': !isWideContent,
        }"
      >
        <NotificationManager />

        <OnboardingNotification v-if="showOnboarding" />

        <BreadcrumbsMenu />

        <router-view
          :key="routeKey"
          v-slot="{ Component }"
          class="app-main-content__view"
        >
          <transition
            mode="out-in"
            name="fade"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import ApiErrorMessage from '@/components/Skeletons/ApiErrorMessage.vue'
import AppSidebar from '@/components/Sidebar/AppSidebar.vue'
import BreadcrumbsMenu from '@/components/BreadcrumbsMenu.vue'
import GlobalHeader from '@/components/Global/GlobalHeader.vue'
import KLoader from '@/components/KLoader.vue'
import NotificationManager from '@/components/NotificationManager/NotificationManager.vue'
import OnboardingNotification from '@/components/NotificationManager/components/OnboardingNotification.vue'

export default {
  name: 'App',

  components: {
    ApiErrorMessage,
    AppSidebar,
    BreadcrumbsMenu,
    GlobalHeader,
    KLoader,
    NotificationManager,
    OnboardingNotification,
  },

  data() {
    return {
      loading: true,
      timeout: null,
    }
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
    }),

    ...mapGetters({
      showOnboarding: 'onboarding/showOnboarding',
      status: 'config/getStatus',
    }),

    /**
     * The `router-view`’s `key` attribute value.
     *
     * Is always set to `'default'` (i.e. will never trigger an explicit re-render via Vue’s `key` mechanism).
     * However, in some scenarios, we want Vue to re-render a route’s components
     * (e.g. `src/views/Policies/PolicyView.vue` which is used by some dozen policy routes).
     */
    routeKey() {
      if (this.$route.meta.shouldReRender) {
        return this.$route.path
      }

      return 'default'
    },

    isWideContent() {
      return ['data-plane-list-view'].includes(this.$route.name)
    },
  },

  watch: {
    globalLoading: function (loading) {
      this.timeout = setTimeout(() => {
        this.loading = loading
      }, 200)
    },

    '$route.meta': function (routeMeta) {
      const siteTitle = `${import.meta.env.VITE_NAMESPACE} Manager`

      document.title = routeMeta?.title ? `${routeMeta.title} | ${siteTitle}` : siteTitle
    },
  },

  beforeMount() {
    this.bootstrap()
  },

  unmounted() {
    clearTimeout(this.timeout)
  },

  methods: {
    ...mapActions(['bootstrap']),
  },
}
</script>

<style lang="scss" scoped>
.full-screen {
  background: #fff;
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

.app {
  height: 100%;
}

.app-content-container {
  flex-grow: 1;
  margin-left: calc(var(--sidebarCollapsedWidth) + var(--subnavWidth));
}

.app-main-content {
  padding: var(--spacing-lg);
  transition: var(--transitionTiming) margin var(--transition);
  display: flex;
  flex-direction: column;
}

.app-main-content--narrow {
  width: 100%;
  max-width: var(--global-content-max-width);
  margin-right: auto;
  margin-left: auto;
}

.app-main-content--wide .app-main-content__view {
  flex-grow: 1;
}
</style>
