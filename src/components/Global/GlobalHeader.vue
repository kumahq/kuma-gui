<template>
  <header class="main-header px-4 py-1 flex justify-between items-center">
    <div class="py-1 md:py-0 flex justify-between items-center">
      <router-link
        :to="{
          name: 'global-overview',
          params: {
            mesh: selectedMesh
          }
        }"
        class="logo"
      >
        <img
          src="@/assets/images/product-logo.png"
          :alt="`${tagline} Logo`"
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
                    <span v-if="multicluster">
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
              <span v-if="multicluster">
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

<script>
import { mapGetters, mapState } from 'vuex'

import NotificationIcon from './NotificationIcon.vue'
import Kuma from '@/services/kuma'
import UpgradeCheck from '@/components/Utils/UpgradeCheck.vue'

export default {
  name: 'GlobalHeader',

  components: {
    UpgradeCheck,
    NotificationIcon,
  },

  data() {
    return {
      shortVersion: '',
      apiUrl: Kuma.url,
      initialBodyPaddingTop: '',
    }
  },

  computed: {
    ...mapState({
      selectedMesh: (state) => state.selectedMesh,
    }),

    ...mapGetters({
      // this checks the status of the API itself
      status: 'config/getStatus',
      environment: 'config/getEnvironment',
      // the status of multicluster
      multicluster: 'config/getMulticlusterStatus',
      tagline: 'config/getTagline',
      version: 'config/getVersion',
    }),

    env() {
      if (this.environment) {
        return `${this.environment.charAt(0).toUpperCase()}${this.environment.slice(1)}`
      }

      return ''
    },

    showStatus() {
      return !this.$route.meta.hideStatus && this.status === 'OK'
    },

    statusContent() {
      if (this.guiStatus) {
        return `${this.tagline} ${this.version}`
      }

      return `Unable to determine ${this.tagline}'s status`
    },

    guiStatus() {
      return Boolean(this.env && this.apiUrl)
    },
  },
}
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
