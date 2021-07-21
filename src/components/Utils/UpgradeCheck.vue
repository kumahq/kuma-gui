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
            {{ tagline }} update available
          </div>
          <div>
            <KButton
              class="warning-button"
              appearance="primary"
              size="small"
              :to="url"
            >
              Update
            </KButton>
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
      url: `${process.env.VUE_APP_INSTALL_URL}${process.env.VUE_APP_UTM}`,
      latestVerSrc: process.env.VUE_APP_VERSION_URL,
      latestVer: null,
      showNotice: false
    }
  },
  computed: {
    ...mapGetters({
      currentVer: 'config/getVersion',
      tagline: 'config/getTagline'
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
            const timespan = 3 // months
            const today = new Date()
            const refDate = new Date('2020-06-03 12:00:00')
            const later = new Date(
              refDate.getFullYear(),
              refDate.getMonth() + timespan,
              refDate.getDate()
            )

            // compare dates and handle the notice accordingly
            if (today.getTime() >= later.getTime()) {
              this.showNotice = true
            } else {
              this.showNotice = false
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
    padding: var(--spacing-xxs) var(--spacing-xs);
  }
}

.alert-content {
  display: flex;
  align-items: center;
  font-size: var(--type-sm);

  > *:first-of-type {
    margin-right: var(--spacing-sm);
  }

  .k-button {
    text-decoration: none;

    &:after {
      display: none;
    }
  }
}

.warning-button {
--KButtonPrimaryBase: #f2a230;
--KButtonPrimaryHover: #f2a230;
--KButtonPrimaryActive: #f2a230;
}

</style>
