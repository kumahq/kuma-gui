<template>
  <div class="upgrade-check">
    <KAlert
      v-if="showNotice"
      appearance="warning"
      size="small"
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
              class="external-link-btn"
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
import axios from 'axios'
import compare from 'semver-compare'
import { mapGetters } from 'vuex'

export default {
  name: 'UpgradeCheck',
  data () {
    return {
      url: 'https://kuma.io/install/latest/',
      latestVerSrc: 'https://kuma.io/latest_version',
      latestVer: null,
      showNotice: false
    }
  },
  computed: {
    ...mapGetters({
      currentVer: 'getVersion'
    })
  },
  beforeMount () {
    this.checkVersion()
  },
  methods: {
    checkVersion () {
      axios.get(this.latestVerSrc)
        .then(response => {
          const status = response.status
          const data = response.data

          if (status === 200 && data && data.length > 0) {
            this.latestVer = data
          }
        })
        .catch(error => {
          this.showNotice = false

          console.error(error)
        })
        .finally(() => {
          if (this.latestVer) {
            // compare the latest version to the currently running version
            // but only if we were able to set the latest version in the first place.
            const comparison = compare(this.latestVer, this.currentVer)

            if (comparison === 1) {
              this.showNotice = true
            } else {
              this.showNotice = false
            }
          } else {
            // if we can't fetch the latest version from the Kuma website,
            // we will store today's date as a reference point.
            const lastVersionCheckDate = localStorage.getItem('lastVersionCheckDate')
            let later
            const today = new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            )

            if (!lastVersionCheckDate) {
              // store today's date in local storage if it's not already present
              localStorage.setItem('lastVersionCheckDate', today)

              later = new Date(
                today.getFullYear(),
                today.getMonth() + 3,
                today.getDate()
              )
            } else {
              later = new Date(
                new Date(lastVersionCheckDate).getFullYear(),
                new Date(lastVersionCheckDate).getMonth() + 3,
                new Date(lastVersionCheckDate).getDate()
              )

              // compare dates and handle the notice accordingly
              if (today.getTime() >= later.getTime()) {
                this.showNotice = true
              } else {
                this.showNotice = false
              }
            }
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.upgrade-check {

  .k-alert.k-alert {
    padding: var(--spacing-xs);
  }
}

.alert-content {
  display: flex;
  align-items: center;
  font-size: var(--type-sm);

  > *:first-of-type {
    margin-right: var(--spacing-md);
  }

  .external-link-btn {
    font-size: inherit;
    padding: var(--spacing-xxs) var(--spacing-xs);

    &:after {
      display: none;
    }
  }
}

.action-button.action-button {
  text-decoration: none;
}
</style>
