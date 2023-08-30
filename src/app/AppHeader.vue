<template>
  <header class="app-header">
    <div class="horizontal-list">
      <router-link :to="{ name: 'home' }">
        <KumaLogo
          data-testid="logo"
        />
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
      v-if="!shouldShowAppError"
      class="horizontal-list"
    >
      <div class="app-status app-status--mobile">
        <KPop width="280">
          <KButton appearance="outline">
            Info
          </KButton>

          <template #content>
            <p>
              {{ t('common.product.name') }} <b>{{ env('KUMA_VERSION') }}</b> on <b>{{ environmentName }}</b> ({{ mode }})
            </p>
          </template>
        </KPop>
      </div>

      <p class="app-status app-status--desktop">
        {{ t('common.product.name') }} <b>{{ env('KUMA_VERSION') }}</b> on <b>{{ environmentName }}</b> ({{ mode }})
      </p>

      <KDropdownMenu
        icon="help"
        button-appearance="outline"
        :kpop-attributes="{ placement: 'bottomEnd' }"
      >
        <template #items>
          <KDropdownItem>
            <a
              :href="t('common.product.href.docs.index')"
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
        data-testid="nav-item-diagnostics"
      >
        <template #icon>
          <KIcon
            icon="gearFilled"
            class="k-button-icon"
            :size="KUI_ICON_SIZE_30"
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
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import {
  KButton,
  KDropdownMenu,
  KDropdownItem,
  KIcon,
  KPop,
} from '@kong/kongponents'
import { computed } from 'vue'

import UpgradeCheck from './common/UpgradeCheck.vue'
import { useCan } from '@/app/application'
import {
  useKumaLogo,
  useGithubButton,
} from '@/components'
import { useStore } from '@/store/store'
import { useEnv, useI18n } from '@/utilities'

const [
  KumaLogo,
  GithubButton,
] = [
  useKumaLogo(),
  useGithubButton(),
]

const store = useStore()
const env = useEnv()
const can = useCan()
const { t } = useI18n()

const shouldShowAppError = computed(() => store.getters.shouldShowAppError)
const environmentName = computed(() => {
  const environment = store.getters['config/getEnvironment']

  if (environment) {
    return environment.charAt(0).toUpperCase() + environment.substring(1)
  } else {
    return 'Universal'
  }
})

const mode = can('use zones') ? 'Multi-Zone' : 'Standalone'

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
  gap: $kui-space-80;
  padding-right: $kui-space-80;
  padding-left: $kui-space-80;
  border-bottom: $kui-border-width-10 solid $kui-color-border;
  background-color: $kui-color-background;
}

.gh-star {
  height: 20px;
}

.horizontal-list {
  display: flex;
  align-items: center;
  gap: $kui-space-80;
}

.app-status {
  margin-top: 0;
}

.app-status--desktop {
  color: $kui-color-text-neutral;
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
