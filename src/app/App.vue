<template>
  <RouteView>
    <!-- whilst we don't use the addresses here, -->
    <!-- we want to make sure they are retrived/correctly set -->
    <DataSource
      v-slot="{data: addresses}: ControlPlaneAddressesSource"
      :src="`/control-plane/addresses`"
    >
      <AppLoadingBar v-if="typeof addresses === 'undefined' || route.name === undefined" />

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
            <AppOnboardingNotification v-if="!isWizard" />

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
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { ControlPlaneAddressesSource } from '@/app/control-planes/sources'
import {
  useAppSidebar,
  useAppHeader,
  useAppLoadingBar,
  useAppOnboardingNotification,
} from '@/components'
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
  AppOnboardingNotification,
] = [
  useAppSidebar(),
  useAppHeader(),
  useAppLoadingBar(),
  useAppOnboardingNotification(),
]
const route = useRoute()

const isWizard = computed(() => route.meta.isWizard === true)

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
