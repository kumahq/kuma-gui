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

const WIDE_CONTENT_ROUTE_NAMES = [
  'data-plane-list-view',
  'gateway-list-view',
  'service-list-view',
  'service-detail-view',
]

const store = useStore()
const route = useRoute()

const isLoading = ref(store.state.globalLoading)

/**
 * The `router-view`’s `key` attribute value.
 *
 * Set to the current `route.path` to trigger an explicit re-render via Vue’s `key` mechanism when navigating between routes that only change in dynamic path segments while matching the same route definition.
 *
 * **Example**:
 *
 * From: /mesh/default/services/backend
 * To: /mesh/default/services/ingress
 *
 * Both routes resolve to the same route definition and the router’s default behavior is to not re-render the component in such navigations.
 */
const routeKey = computed(() => route.path)
const shouldShowAppError = computed(() => store.state.config.status !== 'OK')
const shouldSuggestOnboarding = computed(() => store.getters['onboarding/showOnboarding'])
const shouldShowNotificationManager = computed(() => store.getters['notifications/amountOfActions'] > 0)
const isWideContent = computed(() => typeof route.name === 'string' && WIDE_CONTENT_ROUTE_NAMES.includes(route.name))

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
  grid-template-columns: var(--AppSidebarWidth) 1fr;
}

.app-main-content {
  padding: var(--spacing-lg);
}

.app-main-content--narrow {
  width: 100%;
  max-width: 100rem;
  margin-right: auto;
  margin-left: auto;
}
</style>
