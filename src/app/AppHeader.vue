<template>
  <header class="main-header px-4 py-1 flex justify-between items-center">
    <div class="py-1 md:py-0 flex justify-between items-center">
      <router-link
        :to="{
          name: 'global-overview',
          params: {
            mesh: store.state.selectedMesh
          }
        }"
        class="logo"
      >
        <img
          src="@/assets/images/product-logo.png"
          :alt="`${store.state.config.tagline} Logo`"
        >
      </router-link>

      <div class="my-0 mx-6 upgrade-check-wrapper">
        <UpgradeCheck />
      </div>
    </div>

    <div class="flex justify-between items-center">
      <div
        v-if="showStatus"
        class="py-1 md:py-0 md:px-4"
      >
        <div class="app-status app-status--mobile">
          <KPop
            width="300"
            placement="bottomEnd"
          >
            <KButton
              class="kpop-control"
              appearance="primary"
              size="small"
            >
              Info
            </KButton>

            <template #content>
              <div>
                <p>
                  {{ statusContent }} on <strong>{{ env }}</strong>
                </p>

                <p>
                  <KBadge appearance="success">
                    <span v-if="isMulticluster">
                      Multi-Zone
                    </span>

                    <span v-else>
                      Standalone
                    </span>
                  </KBadge>
                </p>
              </div>
            </template>
          </KPop>
        </div>

        <div class="app-status app-status--desktop">
          <div class="app-status-list text-sm">
            <strong> {{ statusContent }} on {{ env }}</strong>

            <KBadge
              appearance="success"
              class="status-badge"
            >
              <span v-if="isMulticluster">
                Multi-Zone
              </span>

              <span v-else>
                Standalone
              </span>
            </KBadge>

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
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { KBadge, KButton, KPop } from '@kong/kongponents'

import { useStore } from '@/store/store'
import Kuma from '@/services/kuma'
import NotificationIcon from '@/components/Global/NotificationIcon.vue'
import UpgradeCheck from '@/components/Utils/UpgradeCheck.vue'

const route = useRoute()
const store = useStore()

const env = computed(() => {
  const environment = store.getters['config/getEnvironment']

  if (environment) {
    return `${environment.charAt(0).toUpperCase()}${environment.slice(1)}`
  } else {
    return ''
  }
})

const showStatus = computed(() => {
  return !route.meta.hideStatus && store.state.config.status === 'OK'
})

const statusContent = computed(() => {
  if (env.value !== '' && Kuma.url !== '') {
    return `${store.state.config.tagline} ${store.state.config.version}`
  } else {
    return `Unable to determine ${store.state.config.tagline}'s status`
  }
})

const isMulticluster = computed(() => store.getters['config/getMulticlusterStatus'])
</script>

<style lang="scss" scoped>
.main-header {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--topbar-height);
  border-bottom: 1px solid var(--black-10);
  background-color: #fff;
}

.logo img {
  max-height: var(--logo-max-height);
}

.app-status {
  display: flex;
  align-items: center;

  .kpop-control {
    max-height: 27px;

    &:after {
      display: none;
    }
  }

  &--desktop {
    letter-spacing: 0.025em;
    color: var(--gray-3);
  }

  @media screen and (min-width: 1024px) {
    &--desktop {
      display: block;
    }

    &--mobile {
      display: none;
    }
  }

  @media screen and (max-width: 1023px) {
    &--desktop {
      display: none;
    }

    &--mobile {
      display: block;
    }
  }
}

@media screen and (max-width: 599px) {
  .upgrade-check-wrapper {
    display: none;
  }
}

.app-status-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
