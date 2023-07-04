<template>
  <RouteView>
    <AppLoadingBar
      v-if="loading || route.name === undefined"
    />

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
            v-if="error"
            data-testid="app-error"
          />
          <template
            v-else
          >
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
          </template>
        </AppView>
      </div>
    </template>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import {
  useAppSidebar,
  useAppHeader,
  useAppLoadingBar,
  useAppErrorMessage,
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
  AppOnboardingNotification,
] = [
  useAppSidebar(),
  useAppHeader(),
  useAppLoadingBar(),
  useAppErrorMessage(),
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
const shouldShowOnboardingNotification = computed(() => store.getters.shouldShowOnboardingNotification)
const loading = ref<boolean>(true)
const error = ref<Error | undefined>()
;(
  async () => {
    try {
      await Promise.all([
        // Fetches basic resources before setting up the router and mounting the
        // application. This is mainly needed to properly redirect users to the
        // onboarding flow in the appropriate scenarios.
        store.dispatch('bootstrap'),
        // Loads available policy types in order to populate the necessary
        // information used for and policy lookups in the app.
        store.dispatch('fetchPolicyTypes'),
      ])
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
)()

</script>
<style lang="scss" scoped>
.app-content-container {
  padding-top: var(--AppHeaderHeight, initial);
  display: var(--AppDisplay);
  grid-template-columns: var(--AppSidebarWidth) 1fr;
}

.app-main-content {
  padding: var(--AppContentPadding);
}
</style>
