<template>
  <div
    class="application-shell"
  >
    <XTeleportSlot
      name="modal-layer"
    />
    <DataSource
      :src="`/me/~notifications`"
      v-slot="{ data: dismissed }"
    >
      <XNotificationHub
        v-if="dismissed"
        uri="application-shell"
        :dismissed="dismissed"
        v-slot="hub"
      >
        <XNotification
          v-if="!can('use state')"
          uri="main-overview.notifications.store-memory"
        >
          <XI18n
            path="main-overview.notifications.store-memory"
          />
        </XNotification>
        <header
          role="banner"
        >
          <div
            class="horizontal-list"
          >
            <slot name="header">
              <XAction :to="{ name: 'home' }">
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
              <aside
                v-if="hub.notifications.size > 0"
              >
                <DataSink
                  :src="`/me/~notifications`"
                >
                  <XLayout
                    type="stack"
                  >
                    <template
                      v-for="[variant, value] in hub.notifications"
                      :key="variant"
                    >
                      <XAlert
                        :variant="variant"
                      >
                        <ul
                          class="notifications"
                        >
                          <li
                            v-for="notification in value"
                            :key="notification"
                            :data-testid="`notification-${notification}`"
                          >
                            <XNotification
                              :uri="notification"
                            />
                          </li>
                        </ul>
                      </XAlert>
                    </template>
                  </XLayout>
                </DataSink>
              </aside>
              <div>
                <slot name="default" />
              </div>
            </XLayout>
          </main>
        </div>
      </XNotificationHub>
    </DataSource>
  </div>
</template>
<script lang="ts" setup>
import GithubButton from 'vue-github-button'

import { useEnv, useI18n, useCan } from '@/app/application'

const slots = defineSlots()

const env = useEnv()
const { t } = useI18n()
const can = useCan()

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
  .application-shell > .app-content-container .app-sidebar > nav {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.notifications {
  padding: 0;
}
.notifications li {
  margin-left: $kui-space-60;
}
.notifications li:only-child {
  list-style-type: none;
  padding: 0;
}

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
  padding: $kui-space-40 $kui-space-40 $kui-space-80 $kui-space-40;
  border-right: $kui-border-width-10 solid $kui-color-border;
  background-color:  $kui-color-background;
  display: flex;
  flex-flow: column nowrap;
}

.navigation-separator {
  width: calc(100% - 2 * $kui-space-40);
  margin: $kui-space-80 $kui-space-40;
  height: 1px;
  background-color: $kui-color-border;
}

nav ul {
  list-style-type: none;
  padding: unset;
  margin: unset;
}
nav :deep(.app-navigator) + .app-navigator {
  margin-top: $kui-space-20;
}
nav :deep(.app-navigator) > a {
  width: 100%;
  display: flex;
  align-items: center;
  padding: $kui-space-40 $kui-space-60 $kui-space-40 $kui-space-70;
  border-radius: 5px;
  text-decoration: none;
  color: currentColor;
  font-size: $kui-font-size-40;
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
  .upgrade-alert {
    // Uses smaller paddings for this particular alert.
    padding: $kui-space-20 $kui-space-40;
    font-size: $kui-font-size-30;
  }

  .upgrade-alert {
    display: flex;
    align-items: center;
    gap: $kui-space-50;
  }
}
</style>
