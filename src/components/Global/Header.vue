<template>
  <header class="main-header p-4">
    <div class="main-header__content flex justify-between items-center -mx-4">
      <div class="px-4">
        <router-link
          to="/"
          exact
          class="logo"
        >
          <img
            src="@/assets/images/kuma-logo.svg?external"
            alt="Kuma Logo"
          >
        </router-link>
      </div>
      <div
        v-if="!$route.meta.hideStatus"
        class="px-4"
      >
        <status :active="appStatus">
          {{ statusContent }}
        </status>
      </div>
    </div>
  </header>
</template>

<script>
import Status from '@/components/Utils/Status'

export default {
  components: {
    Status
  },
  data () {
    return {
      appStatus: false,
      statusContent: null
    }
  },
  beforeMount () {
    this.status()
  },
  methods: {
    status () {
      const env = localStorage.getItem('kumaEnv')
      const apiUrl = localStorage.getItem('kumaApiUrl')

      if (env && apiUrl) {
        this.statusContent = `Kuma is running on ${env}`
        this.appStatus = true
      } else {
        this.statusContent = 'Unable to determine Kuma\'s status'
        this.appStatus = false
      }
    }
  }
}
</script>

<style lang="scss">
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
  margin: 0 auto;
}

.main-header--simple {
  border-bottom: 0;
  background: none;

  .logo {

    img {
      // transform: translateY(68px);
    }
  }
}
</style>
