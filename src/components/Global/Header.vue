<template>
  <header class="main-header p-4">
    <div class="main-header__content flex justify-between items-center -mx-4">
      <div class="py-1 md:py-0 md:px-4">
        <router-link
          :to="{
            name: 'global-overview',
            params: {
              mesh: currentMesh
            }
          }"
          class="logo"
        >
          <img
            src="@/assets/images/kuma-logo-new.svg?external"
            alt="Kuma Logo"
          >
        </router-link>
      </div>
      <div class="md:flex md:justify-between md:items-center">
        <div class="py-1 md:py-0 md:px-4 upgrade-check-wrapper">
          <UpgradeCheck />
        </div>
        <div
          v-if="showStatus"
          class="py-1 md:py-0 md:px-4"
        >
          <status :active="guiStatus">
            <template slot="content">
              <span>{{ statusContent }}</span>
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
            </template>
          </status>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import Status from '@/components/Utils/Status'
import UpgradeCheck from '@/components/Utils/UpgradeCheck'

export default {
  components: {
    Status,
    UpgradeCheck
  },
  data () {
    return {
      guiStatus: false,
      statusContent: null
    }
  },
  computed: {
    ...mapGetters({
      // this checks the status of the API itself
      status: 'getStatus',
      // the currently selected mesh
      currentMesh: 'getSelectedMesh',
      // the status of multicluster
      multicluster: 'getMulticlusterStatus'
    }),
    showStatus () {
      return !this.$route.meta.hideStatus && this.status === 'OK'
    }
  },
  beforeMount () {
    this.getGuiStatus()
  },
  methods: {
    getGuiStatus () {
      // these localStorage items are set on app launch
      const env = localStorage.getItem('kumaEnv')
      const apiUrl = localStorage.getItem('kumaApiUrl')

      // get the other values from our state
      const tagline = this.$store.getters.getTagline
      const version = this.$store.getters.getVersion

      if (env && apiUrl) {
        this.statusContent = `${tagline} v${version} running on ${env}`
        this.guiStatus = true
      } else {
        this.statusContent = "Unable to determine Kuma's status"
        this.guiStatus = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-header {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  min-height: var(--topbar-height);
  border-bottom: 1px solid #eaecef;
  background-color: #fff;
}

.main-header__content {
  max-width: var(--global-content-max-width);
  margin: 0 auto;
}

.main-header--simple {
  border-bottom: 0;
  background: none;
}

.logo {

  img {
    display: block;
    width: auto;
    height: auto;
    max-height: 46px;
  }
}

.upgrade-check-wrapper {
  margin-left: auto;
}

.status-badge {
  --KBadgeWidth: auto;
  --KBadgePaddingX: var(--spacing-sm);
}

@media screen and (min-width: 990px) {
  .status-badge {
    margin-left: var(--spacing-sm);
  }
}

@media screen and (max-width: 989px) {
  .status-badge {
    margin-top: var(--spacing-sm);
  }
}

@media screen and (max-width: 599px) {
  .upgrade-check-wrapper {
    display: none;
  }
}
</style>
