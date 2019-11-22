<template>
  <header class="main-header p-4">
    <div class="main-header__content flex justify-between items-center -mx-4">
      <div class="px-4">
        <router-link
          to="/"
          exact
        >
          <img
            src="@/assets/images/kuma-logo.svg?external"
            alt="Kuma Logo"
          >
        </router-link>
      </div>
      <div class="px-4">
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

<style scoped>
.main-header {
  min-height: var(--topbar-height);
  border-bottom: 1px solid #eaecef;
}

.main-header__content {
  margin: 0 auto;
}
</style>
