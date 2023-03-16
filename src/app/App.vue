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

      <main class="app-main-content">
        <AppErrorMessage v-if="shouldShowAppError" />

        <NotificationManager v-if="shouldShowNotificationManager" />

        <AppOnboardingNotification v-if="shouldShowOnboardingNotification" />

        <AppBreadcrumbs v-if="shouldShowBreadcrumbs" />

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

import AppBreadcrumbs from './AppBreadcrumbs.vue'
import AppErrorMessage from './AppErrorMessage.vue'
import AppLoadingBar from './AppLoadingBar.vue'
import AppOnboardingNotification from './AppOnboardingNotification.vue'
import NotificationManager from '@/app/notification-manager/components/NotificationManager.vue'
import {
  useAppSidebar,
  useAppHeader,
} from '@/components'
import { useStore } from '@/store/store'

const [
  AppSidebar,
  AppHeader,
] = [
  useAppSidebar(),
  useAppHeader(),
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
const shouldShowAppError = computed(() => store.getters.shouldShowAppError)
const shouldShowNotificationManager = computed(() => store.getters.shouldShowNotificationManager)
const shouldShowOnboardingNotification = computed(() => store.getters.shouldShowOnboardingNotification)
const shouldShowBreadcrumbs = computed(() => store.getters.getShouldShowBreadcrumbs(route.meta))

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
</style>
