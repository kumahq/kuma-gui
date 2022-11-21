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

      <GithubButton
        class="gh-star"
        href="https://github.com/kumahq/kuma"
        aria-label="Star kumahq/kuma on GitHub"
      >
        Star
      </GithubButton>

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

      <NotificationIcon v-if="shouldShowNotificationManager" />

      <KDropdownMenu
        class="help-menu"
        icon="help"
        button-appearance="outline"
        :kpop-attributes="{ placement: 'bottomEnd' }"
      >
        <template #items>
          <KDropdownItem>
            <a
              :href="`${env('KUMA_DOCS_URL')}?${env('KUMA_UTM_QUERY_PARAMS')}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </KDropdownItem>
          <KDropdownItem>
            <a
              :href="env('KUMA_FEEDBACK_URL')"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feedback
            </a>
          </KDropdownItem>
        </template>
      </KDropdownMenu>
      <KButton
        :to="{ name: 'diagnostics' }"
        icon="gearFilled"
        button-appearance="btn-link"
      >
        <template #icon>
          <KIcon
            icon="gearFilled"
            class="k-button-icon"
            size="16"
            color="currentColor"
            hide-title
          />
        </template>
        <span class="visually-hidden">Diagnostics</span>
      </KButton>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  KButton,
  KDropdownMenu,
  KDropdownItem,
  KIcon,
  KPop,
} from '@kong/kongponents'
import GithubButton from 'vue-github-button'

import { useStore } from '@/store/store'
import { useEnv } from '@/composables'
import NotificationIcon from './common/NotificationIcon.vue'
import UpgradeCheck from './common/UpgradeCheck.vue'

const store = useStore()
const env = useEnv({ version: store.getters['config/getKumaDocsVersion'] })

const shouldShowNotificationManager = computed(() => store.getters['notifications/amountOfActions'] > 0)
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
  z-index: 11;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--AppHeaderHeight);
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
.gh-star {
  height: 20px;
}

.horizontal-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.app-status--desktop {
  color: var(--grey-500);
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
