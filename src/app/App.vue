<template>
  <div
    v-if="isLoading"
    class="full-screen"
  >
    <AppLoadingBar />
  </div>

  <template v-else>
    <AppHeader />

    <div v-if="shouldShowOnboarding">
      <router-view />
    </div>

    <div
      v-else
      class="app-content-container"
    >
      <AppSidebar />

      <main
        class="app-main-content"
        :class="{
          'app-main-content--wide': isWideContent,
          'app-main-content--narrow': !isWideContent,
        }"
      >
        <AppErrorMessage v-if="store.state.config.status !== 'OK'" />

        <NotificationManager />

        <AppOnboardingNotification v-if="shouldShowOnboarding" />

        <AppBreadcrumbs />

        <router-view
          :key="routeKey"
          v-slot="{ Component }"
        >
          <transition
            mode="out-in"
            name="fade"
          >
            <div
              :key="(route.name as string)"
              class="transition-root"
            >
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </main>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { onBeforeMount, onUnmounted, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '@/store/store'
import AppBreadcrumbs from './AppBreadcrumbs.vue'
import AppErrorMessage from './AppErrorMessage.vue'
import AppHeader from './AppHeader.vue'
import AppLoadingBar from './AppLoadingBar.vue'
import AppOnboardingNotification from './AppOnboardingNotification.vue'
import AppSidebar from './AppSidebar.vue'
import NotificationManager from '@/components/NotificationManager/NotificationManager.vue'

const store = useStore()
const route = useRoute()

const isLoading = ref(true)
const timeout = ref<number | null>(null)

/**
 * The `router-view`’s `key` attribute value.
 *
 * Is always set to `'default'` (i.e. will never trigger an explicit re-render via Vue’s `key` mechanism).
 * However, in some scenarios, we want Vue to re-render a route’s components
 * (e.g. `src/app/policies/PolicyView.vue` which is used by some dozen policy routes).
 */
const routeKey = computed(() => route.meta.shouldReRender ? route.path : 'default')
const shouldShowOnboarding = computed(() => store.getters['onboarding/showOnboarding'])
const isWideContent = computed(() => typeof route.name === 'string' && ['data-plane-list-view'].includes(route.name))

watch(() => store.state.globalLoading, function (globalLoading) {
  timeout.value = window.setTimeout(() => {
    isLoading.value = globalLoading
  }, 200)
})

watch(() => route.meta.title, function (pageTitle) {
  setDocumentTitle(pageTitle)
})

watch(() => store.state.pageTitle, function (pageTitle) {
  setDocumentTitle(pageTitle)
})

onBeforeMount(function () {
  store.dispatch('bootstrap')
})

onUnmounted(function () {
  if (typeof timeout.value === 'number') {
    window.clearTimeout(timeout.value)
  }
})

function setDocumentTitle(title: string | undefined): void {
  const siteTitle = `${import.meta.env.VITE_NAMESPACE} Manager`

  document.title = title ? `${title} | ${siteTitle}` : siteTitle
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

.app-content-container {
  display: grid;
  grid-template-columns: var(--subnavWidth) 1fr;
}

.app-main-content {
  padding: var(--spacing-lg);
}

.app-main-content--narrow {
  width: 100%;
  max-width: var(--global-content-max-width);
  margin-right: auto;
  margin-left: auto;
}
</style>
