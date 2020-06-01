<template>
  <div class="upgrade-check">
    <KAlert
      v-if="showNotice"
      appearance="warning"
    >
      <template slot="alertMessage">
        <div class="alert-content">
          <div>
            You are running an outdated version of Kuma.
          </div>
          <div>
            <a
              :href="url"
              target="_blank"
              class="external-link"
            >
              Upgrade
            </a>
          </div>
        </div>
      </template>
    </KAlert>
  </div>
</template>

<script>
export default {
  name: 'UpgradeCheck',
  data () {
    return {
      url: 'https://kuma.io/install/latest/'
    }
  },
  computed: {
    showNotice () {
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.upgrade-check {
  margin: 0 0 var(--spacing-xl) 0;
}

.alert-content {
  display: flex;
  align-items: center;

  > *:first-of-type {
    margin-right: var(--spacing-md);
  }
}

.action-button.action-button {
  text-decoration: none;
}
</style>
