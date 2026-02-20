<template>
  <div
    class="application-shell"
  >
    <XTeleportSlot
      name="modal-layer"
    />
    <header
      role="banner"
    >
      <div
        class="horizontal-list"
      >
        <slot name="header">
          <XAction :to="{ name: 'control-plane-root-view' }">
            <slot name="home" />
          </XAction>

          <GithubButton
            class="gh-star"
            href="https://github.com/kumahq/kuma"
            aria-label="Star kumahq/kuma on GitHub"
          >
            Star
          </GithubButton>

          <div class="upgrade-check-wrapper">
            <DataSource
              :src="`/control-plane/version/latest`"
              v-slot="{ data }"
            >
              <!-- make sure we have data but don't show errors or loaders -->
              <XAlert
                v-if="data && env('KUMA_VERSION') !== data.version"
                class="upgrade-alert"
                data-testid="upgrade-check"
                appearance="info"
              >
                <XLayout
                  type="separated"
                >
                  <p>
                    {{ t('common.product.name') }} update available
                  </p>

                  <XAction
                    appearance="primary"
                    :href="t('common.product.href.install')"
                  >
                    Update
                  </XAction>
                </XLayout>
              </XAlert>
            </DataSource>
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
            <XPop
              width="280"
            >
              <XAction
                appearance="tertiary"
              >
                Info
              </XAction>

              <template #content>
                <p>
                  {{ t('common.product.name') }} <b>{{ env('KUMA_VERSION') }}</b> on <b>{{ t(`common.product.environment.${env('KUMA_ENVIRONMENT')}`) }}</b> ({{ t(`common.product.mode.${env('KUMA_MODE')}`) }})
                </p>
              </template>
            </XPop>
          </div>

          <p class="app-status app-status--desktop">
            {{ t('common.product.name') }} <b>{{ env('KUMA_VERSION') }}</b> on <b>{{ t(`common.product.environment.${env('KUMA_ENVIRONMENT')}`) }}</b> ({{ t(`common.product.mode.${env('KUMA_MODE')}`) }})
          </p>

          <XActionGroup>
            <template
              #control
            >
              <XAction
                appearance="tertiary"
              >
                <XIcon
                  name="help"
                >
                  Help
                </XIcon>
              </XAction>
            </template>
            <XAction
              :href="t('common.product.href.docs.index')"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </XAction>
            <XAction
              :href="t('common.product.href.feedback')"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feedback
            </XAction>
          </XActionGroup>
        </slot>
      </div>
    </header>
    <div
      class="app-content-container"
    >
      <div class="app-sidebar">
        <nav
          aria-label="Main"
        >
          <ul v-if="slots.navigation">
            <slot name="navigation" />
          </ul>

          <div
            v-if="slots.navigation && slots.bottomNavigation"
            role="separator"
            class="navigation-separator"
          />

          <ul v-if="slots.bottomNavigation">
            <slot name="bottomNavigation" />
          </ul>
        </nav>
      </div>
      <main
        class="app-main-content"
      >
        <XLayout
          type="stack"
        >
          <div>
            <slot name="default" />
          </div>
        </XLayout>
      </main>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GithubButton from 'vue-github-button'

import { useEnv, useI18n } from '@/app/application'

const slots = defineSlots()

const env = useEnv()
const { t } = useI18n()

</script>
<style lang="scss" scoped>
.application-shell {
  --AppHeaderHeight: 60px;
  --AppSidebarWidth: 240px;
  --AppContentPadding: var(--x-space-80);
  --x-drawer-offset-top: var(--AppHeaderHeight);

}
.app-content-container {
  display: grid;
  padding-top: var(--AppHeaderHeight, initial);
  // Note: `minmax(0, 1fr)` is used because `1fr` implies `minmax(auto, 1fr)` which will allow grid items to grow beyond their container's size.
  grid-template-columns: var(--AppSidebarWidth) minmax(0, 1fr);
}

.app-main-content {
  padding: var(--AppContentPadding);
  min-height: calc(100vh - var(--AppHeaderHeight));
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
  gap: var(--x-space-80);
  padding-right: var(--x-space-80);
  padding-left: var(--x-space-80);
  border-bottom: var(--x-border-width-10) solid var(--x-color-border);
  background-color: var(--x-color-background);
}

.horizontal-list {
  display: flex;
  align-items: center;
  gap: var(--x-space-80);
}
// This wrapping element is necessary. It ensures that the sidebar can participate in a grid or flex container.
.app-sidebar {
  position: static;
}

nav {
  position: fixed;
  padding: 0;
  width: var(--AppSidebarWidth);
  z-index: 10;
  top: var(--AppHeaderHeight);
  bottom: 0;
  left: 0;
  overflow-y: auto;
  padding: var(--x-space-40) var(--x-space-40) var(--x-space-80) var(--x-space-40);
  border-right: var(--x-border-width-10) solid var(--x-color-border);
  background-color:  var(--x-color-background);
  display: flex;
  flex-flow: column nowrap;
}

.navigation-separator {
  width: calc(100% - 2 * var(--x-space-40));
  margin: var(--x-space-80) var(--x-space-40);
  height: 1px;
  background-color: var(--x-color-border);
}

nav ul {
  list-style-type: none;
  padding: unset;
  margin: unset;
}
nav :deep(.app-navigator) + .app-navigator {
  margin-top: var(--x-space-20);
}
nav :deep(.app-navigator) > a {
  width: 100%;
  display: inline-block;
  padding: var(--x-space-40) var(--x-space-60) var(--x-space-40) var(--x-space-70);
  border-radius: 5px;
  text-decoration: none;
  color: currentColor;
  font-size: var(--x-font-size-40);
  &:hover,
  &:is(.is-active) {
    background-color: var(--x-color-background-neutral-weaker);
  }
}

.gh-star {
  height: 20px;
}
.app-status {
  margin-top: 0;
  color: var(--x-color-text-neutral);
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
  .upgrade-alert {
    // Uses smaller paddings for this particular alert.
    padding: var(--x-space-20) var(--x-space-40);
    font-size: var(--x-font-size-30);
  }

  .upgrade-alert {
    display: flex;
    align-items: center;
    gap: var(--x-space-50);
  }
}
</style>
