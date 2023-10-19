<template>
  <div
    class="application-shell"
  >
    <header
      role="banner"
    >
      <div
        class="horizontal-list"
      >
        <slot name="header">
          <RouterLink :to="{ name: 'home' }">
            <slot name="home" />
          </RouterLink>

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
        </slot>
      </div>
      <div
        class="horizontal-list"
      >
        <slot name="content-info">
          <div
            class="app-status app-status--mobile"
          >
            <KPop
              width="280"
            >
              <KButton
                appearance="tertiary"
              >
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
            <KButton
              appearance="tertiary"
              icon-only
            >
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

              <KDropdownItem
                :item="{
                  to: { name: 'onboarding-welcome-view' },
                  label: 'Onboarding',
                }"
              />
            </template>
          </KDropdownMenu>

          <KButton
            :to="{ name: 'diagnostics' }"
            appearance="tertiary"
            icon-only
            data-testid="nav-item-diagnostics"
          >
            <CogIcon
              :size="KUI_ICON_SIZE_30"
              hide-title
            />

            <span class="visually-hidden">Diagnostics</span>
          </KButton>
        </slot>
      </div>
    </header>
    <div
      class="app-content-container"
    >
      <nav
        v-if="$slots.navigation"
        aria-label="Main"
        class="app-sidebar"
      >
        <ul>
          <slot name="navigation" />
        </ul>
      </nav>
      <div
        class="app-main-content"
      >
        <div class="app-notifications">
          <slot name="notifications" />
        </div>
        <slot
          name="notifications"
        >
          <KAlert
            v-if="!can('use state')"
            class="mb-4"
            appearance="warning"
          >
            <template #alertMessage>
              <ul>
                <!-- eslint-disable vue/no-v-html  -->
                <li
                  data-testid="warning-GLOBAL_STORE_TYPE_MEMORY"
                  v-html="t('common.warnings.GLOBAL_STORE_TYPE_MEMORY')"
                />
                <!-- eslint-enable -->
              </ul>
            </template>
          </KAlert>
        </slot>
        <slot name="default" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { CogIcon, HelpIcon } from '@kong/icons'
import GithubButton from 'vue-github-button'

import { useEnv, useI18n, useCan } from '@/app/application'
import UpgradeCheck from '@/app/common/UpgradeCheck.vue'

const env = useEnv()
const can = useCan()
const { t } = useI18n()

</script>
<style lang="scss">
html.is-fullscreen {
  .application-shell > header {
    display: none;
  }
  .application-shell > .app-content-container > nav {
    display: none;
  }
  .application-shell > .app-content-container > .app-notifications {
    display: none;
  }
}
html.no-navigation {
  .application-shell > .app-content-container > nav {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.app-content-container {
  padding-top: var(--AppHeaderHeight, initial);
  display: var(--AppDisplay);
  // Note: `minmax(0, 1fr)` is used because `1fr` implies `minmax(auto, 1fr)` which will allow grid items to grow beyond their container's size.
  grid-template-columns: var(--AppSidebarWidth) minmax(0, 1fr);
}

.app-main-content {
  padding: var(--AppContentPadding);
}

header {
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

.horizontal-list {
  display: flex;
  align-items: center;
  gap: $kui-space-80;
}
// This wrapping element is necessary. It ensures that the sidebar can participate in a grid or flex container.
nav {
  position: static;
}

nav ul {
  list-style-type: none;
  padding: 0;
  width: var(--AppSidebarWidth);
  position: fixed;
  z-index: 10;
  top: var(--AppHeaderHeight);
  bottom: 0;
  left: 0;
  overflow-y: auto;
  padding-top: $kui-space-40;
  padding-right: $kui-space-40;
  border-right: $kui-border-width-10 solid $kui-color-border;
  background-color:  $kui-color-background;
}
nav :deep(.app-navigator) {
  margin-left: $kui-space-40;
}
nav :deep(.app-navigator) + .app-navigator {
  margin-top: $kui-space-20;
}
nav :deep(.app-navigator) > a {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $kui-space-40 $kui-space-60;
  border-radius: 5px;
  text-decoration: none;
  color: currentColor;
  &:hover,
  &:is(.is-active) {
    background-color: $kui-color-background-neutral-weaker;
  }
}

.gh-star {
  height: 20px;
}
.app-status {
  margin-top: 0;
  color: $kui-color-text-neutral;
}
.app-status--desktop {
  display: none;

  @media screen and (min-width: 1005px) {
    display: block;
  }
}
.app-status--mobile {
  display: block;

  @media screen and (min-width: 1005px) {
    display: none;
  }
}

.upgrade-check-wrapper {
  @media screen and (max-width: 800px) {
    display: none;
  }
}

</style>
