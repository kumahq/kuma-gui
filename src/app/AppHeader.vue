<template>
  <header class="app-header">
    <div class="horizontal-list">
      <router-link :to="{ name: 'home' }">
        <img
          class="logo-image"
          src="@/assets/images/product-logo.png"
          :alt="`${store.state.config.tagline} Logo`"
        >
      </router-link>

      <div class="upgrade-check-wrapper">
        <UpgradeCheck />
      </div>
    </div>

    <div
      v-if="store.state.config.status === 'OK'"
      class="horizontal-list"
    >
      <div class="app-status app-status--mobile">
        <KPop width="280">
          <KButton appearance="outline">
            Info
          </KButton>

          <template #content>
            <p>
              {{ store.state.config.tagline }} <b>{{ store.state.config.version }}</b> on <b>{{ environmentName }}</b> ({{ mode }})
            </p>
          </template>
        </KPop>
      </div>

      <p class="app-status app-status--desktop">
        {{ store.state.config.tagline }} <b>{{ store.state.config.version }}</b> on <b>{{ environmentName }}</b> ({{ mode }})
      </p>

      <NotificationIcon />

      <router-link :to="{ name: 'diagnostics' }">
        <KIcon
          icon="gearFilled"
          color="currentColor"
          title="Diagnostics"
        />

        <span class="kutil-sr-only">Diagnostics</span>
      </router-link>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { KButton, KIcon, KPop } from '@kong/kongponents'

import { useStore } from '@/store/store'
import NotificationIcon from '@/components/Global/NotificationIcon.vue'
import UpgradeCheck from '@/components/Utils/UpgradeCheck.vue'

const store = useStore()

const environmentName = computed(() => {
  const environment = store.getters['config/getEnvironment']

  if (environment) {
    return environment.charAt(0).toUpperCase() + environment.substring(1)
  } else {
    return 'Universal'
  }
})

const mode = computed(() => store.getters['config/getMulticlusterStatus'] ? 'Multi-Zone' : 'Standalone')
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--topbar-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: var(--spacing-lg);
  padding-left: var(--spacing-lg);
  border-bottom: 1px solid var(--black-10);
  background-color: var(--white);
}

.logo-image {
  max-height: 36px;
}

.horizontal-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.app-status--desktop {
  color: var(--gray-3);
  display: none;

  @media screen and (min-width: 900px) {
    display: block;
  }
}

.app-status--mobile {
  display: block;

  @media screen and (min-width: 900px) {
    display: none;
  }
}

.upgrade-check-wrapper {
  @media screen and (max-width: 600px) {
    display: none;
  }
}
</style>
