<template>
  <RouteView>
    <AppLoadingBar v-if="store.state.globalLoading || route.name === undefined" />

    <template v-else>
      <AppHeader v-if="!isWizard" />

      <div v-if="route.meta.onboardingProcess">
        <RouterView />
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

          <AppOnboardingNotification v-if="!isWizard && shouldShowOnboardingNotification" />

          <RouterView v-slot="{ Component }">
            <transition
              mode="out-in"
              name="fade"
            >
              <div class="transition-root">
                <component
                  :is="Component"
                  :data="props.data"
                />
              </div>
            </transition>
          </RouterView>
        </AppView>
      </div>
    </template>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
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

const isWizard = computed(() => route.meta.isWizard === true)
const shouldShowAppError = computed(() => store.getters.shouldShowAppError)
const shouldShowOnboardingNotification = computed(() => store.getters.shouldShowOnboardingNotification)

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
