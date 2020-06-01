<template>
  <header class="main-header p-4">
    <div class="main-header__content flex justify-between items-center -mx-4">
      <div class="px-4">
        <router-link
          :to="{ name: 'global-overview' }"
          exact
          class="logo"
        >
          <img
            src="@/assets/images/kuma-logo-new.svg?external"
            alt="Kuma Logo"
          >
        </router-link>
      </div>
      <div
        v-if="showStatus"
        class="px-4"
      >
        <status
          :active="guiStatus"
          :content="statusContent"
        />
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import Status from '@/components/Utils/Status'

export default {
  components: {
    Status
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
      currentMesh: 'getSelectedMesh'
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
      const env = localStorage.getItem('kumaEnv')
      const apiUrl = localStorage.getItem('kumaApiUrl')
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
</style>
