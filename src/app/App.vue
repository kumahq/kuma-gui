<template>
  <AppLoadingBar v-if="isLoading" />

  <template v-else>
    <AppHeader />

    <div v-if="route.meta.onboardingProcess">
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
        <AppErrorMessage v-if="shouldShowAppError" />

        <NotificationManager v-if="shouldShowNotificationManager" />

        <AppOnboardingNotification v-if="shouldSuggestOnboarding" />

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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '@/store/store'
import AppBreadcrumbs from './AppBreadcrumbs.vue'
import AppErrorMessage from './AppErrorMessage.vue'
import AppHeader from './AppHeader.vue'
import AppLoadingBar from './AppLoadingBar.vue'
import AppOnboardingNotification from './AppOnboardingNotification.vue'
import AppSidebar from './AppSidebar.vue'
import NotificationManager from '@/app/notification-manager/components/NotificationManager.vue'

const store = useStore()
const route = useRoute()

const isLoading = ref(store.state.globalLoading)

/**
 * The `router-view`’s `key` attribute value.
 *
 * Is always set to `'NONE'` (i.e. will never trigger an explicit re-render via Vue’s `key` mechanism).
 * However, in some scenarios, we want Vue to re-render a route’s components
 * (e.g. `src/app/policies/views/PolicyView.vue` which is used by some dozen policy routes).
 */
const routeKey = computed(() => route.meta.shouldReRender ? route.path : 'NONE')
const shouldShowAppError = computed(() => store.state.config.status !== 'OK')
const shouldSuggestOnboarding = computed(() => store.getters['onboarding/showOnboarding'])
const shouldShowNotificationManager = computed(() => store.getters['notifications/amountOfActions'] > 0)
const isWideContent = computed(() => typeof route.name === 'string' && ['data-plane-list-view', 'service-list-view'].includes(route.name))

watch(() => store.state.globalLoading, function (globalLoading) {
  isLoading.value = globalLoading
})

watch(() => route.meta.title, function (pageTitle) {
  setDocumentTitle(pageTitle)
})

watch(() => store.state.pageTitle, function (pageTitle) {
  setDocumentTitle(pageTitle)
})

function setDocumentTitle(title: string | undefined): void {
  const siteTitle = `${import.meta.env.VITE_NAMESPACE} Manager`

  document.title = title ? `${title} | ${siteTitle}` : siteTitle
}
</script>

<style lang="scss" scoped>
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
