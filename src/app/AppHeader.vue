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
      class="horizontal-list"
    >
      <div class="app-status app-status--mobile">
        <KPop width="280">
          <KButton appearance="outline">
            Info
          </KButton>

          <template #content>
            <p>
              {{ t('common.product.name') }} <b>{{ env('KUMA_VERSION') }}</b> on <b>{{ t(`common.product.environment.${env('KUMA_ENVIRONMENT')}`) }}</b> ({{ t(`common.product.mode.${env('KUMA_MODE')}`) }})
            </p>
          </template>
        </KPop>
      </div>

      <p class="app-status app-status--desktop">
        {{ t('common.product.name') }} <b>{{ env('KUMA_VERSION') }}</b> on <b>{{ t(`common.product.environment.${env('KUMA_ENVIRONMENT')}`) }}</b> ({{ t(`common.product.mode.${env('KUMA_MODE')}`) }})
      </p>

      <KDropdownMenu :kpop-attributes="{ placement: 'bottomEnd' }">
        <KButton appearance="outline">
          <HelpIcon :size="KUI_ICON_SIZE_30" />

          <span class="visually-hidden">Help</span>
        </KButton>

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
        button-appearance="btn-link"
        data-testid="nav-item-diagnostics"
      >
        <CogIcon
          :size="KUI_ICON_SIZE_30"
          hide-title
        />

        <span class="visually-hidden">Diagnostics</span>
      </KButton>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { CogIcon, HelpIcon } from '@kong/icons'
import {
  KButton,
  KDropdownMenu,
  KDropdownItem,
  KPop,
} from '@kong/kongponents'

import UpgradeCheck from './common/UpgradeCheck.vue'
import {
  useKumaLogo,
  useGithubButton,
} from '@/components'
import { useEnv, useI18n } from '@/utilities'

const [
  KumaLogo,
  GithubButton,
] = [
  useKumaLogo(),
  useGithubButton(),
]

const env = useEnv()
const { t } = useI18n()

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
