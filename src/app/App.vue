<template>
  <RouteView>
    <AppLoadingBar v-if="store.state.globalLoading || route.name === undefined" />

    <template v-else>
      <AppHeader v-if="!isWizard" />

      <div v-if="route.meta.onboardingProcess">
        <router-view />
      </div>

      <div
        v-else
        class="app-content-container"
      >
        <AppSidebar v-if="!isWizard" />

        <AppView>
          <AppErrorMessage
            v-if="shouldShowAppError"
            data-testid="app-error"
          />

          <NotificationManager v-if="!isWizard && shouldShowNotificationManager" />

          <AppOnboardingNotification v-if="!isWizard && shouldShowOnboardingNotification" />

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
                <component
                  :is="Component"
                  :data="props.data"
                />
              </div>
            </transition>
          </router-view>
        </AppView>
      </div>
    </template>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import {
  useAppSidebar,
  useAppHeader,
  useAppLoadingBar,
  useAppErrorMessage,
  useNotificationManager,
  useAppOnboardingNotification,
} from '@/components'
import { useStore } from '@/store/store'
const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: undefined,
  },
})
const [
  AppSidebar,
  AppHeader,
  AppLoadingBar,
  AppErrorMessage,
  NotificationManager,
  AppOnboardingNotification,
] = [
  useAppSidebar(),
  useAppHeader(),
  useAppLoadingBar(),
  useAppErrorMessage(),
  useNotificationManager(),
  useAppOnboardingNotification(),
]
const store = useStore()
const route = useRoute()

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
const isWizard = computed(() => route.meta.isWizard === true)
const shouldShowAppError = computed(() => store.getters.shouldShowAppError)
const shouldShowNotificationManager = computed(() => store.getters.shouldShowNotificationManager)
const shouldShowOnboardingNotification = computed(() => store.getters.shouldShowOnboardingNotification)

watch(() => isWizard.value, setIsWizardPageClass, { immediate: true })

/**
 * Adds a class for wizard pages to the body element. This is used to control certain layout aspects of the app.
 */
function setIsWizardPageClass(isWizard: boolean) {
  const hasClass = document.body.classList.contains('is-wizard-page')

  if (isWizard && !hasClass) {
    document.body.classList.add('is-wizard-page')
  } else if (!isWizard && hasClass) {
    document.body.classList.remove('is-wizard-page')
  }
}
</script>

<style lang="scss" scoped>
body:not(.is-wizard-page) .app-content-container {
  padding-top: var(--AppHeaderHeight, initial);
  display: grid;
  grid-template-columns: var(--AppSidebarWidth) 1fr;
}

body:not(.is-wizard-page) .app-main-content {
  padding: var(--AppGap);
}
</style>
