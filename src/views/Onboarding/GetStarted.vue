<template>
  <div class="welcome welcome__step-1">
    <p class="lg">
      Kuma has been successfully installed, you’re one step away to build a
      modern cloud-native architecture!
    </p>

    <div class="app-setup">
      <h3 class="xl">
        Let's set up your app
      </h3>

      <div
        class="app-source-check"
        :class="{ 'app-source-check--error': appSourceError }"
      >
        <div
          v-if="appSource
            && appSource === 'universal'
            || appSource === 'kubernetes'
            || appSource === 'k8s'"
          class="app-source-check__inner flex items-center -mx-4"
        >
          <div class="app-source-check__icon px-4">
            <img
              v-if="appSource === 'universal'"
              src="@/assets/images/icon-universal-alt.png?external"
              alt="Kuma Universal Icon"
            >
            <img
              v-else-if="appSource === 'kubernetes' || appSource === 'k8s'"
              src="@/assets/images/icon-k8s.png?external"
              alt="Kuma Kubernetes Icon"
            >
          </div>
          <div class="app-source-check__content px-4">
            <p>Kuma is running on {{ appSource }}</p>
          </div>
          <div class="px-4">
            <img
              src="@/assets/images/icon-checkmark.svg?external"
              alt="Checkmark Icon"
            >
          </div>
        </div>
        <div v-else>
          <p>The app was unable to determine Kuma's environment.</p>
        </div>
      </div>

      <KTable
        v-if="tableData"
        :options="tableData"
      />
    </div>
    <!-- .app-source-check -->

    <div class="app-setup-demo">
      <h4 class="lg mb-4">
        Try with a Demo App instead
      </h4>
      <p class="lg light-text">
        If you don’t have an application ready for Kuma, you can deploy a Demo App.
        This can be removed later from the settings page.
      </p>
    </div>
    </ktable>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OnboardingStep1',
  metaInfo: {
    title: 'Welcome to Kuma!'
  },
  data () {
    return {
      appSource: false,
      appSourceError: false,
      tableData: {
        headers: [
          { label: 'Dataplane', key: 'name' },
          { label: 'Mesh', key: 'mesh' }
        ],
        data: []
      }
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false

      this.getAppType()
      this.getDataplaneTableData()
    },

    async getDataplaneTableData () {
      const dataplanes = this.$store.getters.getDataplanesList

      Object.values(dataplanes).map(val => {
        this.tableData.data.push(val)
      })
    },

    getAppType () {
      axios
        .get(process.env.VUE_APP_KUMA_CONFIG)
        .then(response => {
          if (response.status === 200) {
            this.appSource = response.data.environment
          } else {
            this.appSourceError = true
          }
        })
        .catch(error => {
          this.appSource = false
          this.appSourceError = false
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss">
.app-setup {
  padding: var(--spacing-xl) 0;
  margin: var(--spacing-xl) 0;
  border-top: 1px solid var(--tblack-10);
  // border-bottom: 1px solid var(--tblack-10);
}

.app-source-check {
  background-color: var(--blue-lighter);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 4px;
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.app-source-check--error {
  background-color: var(--red-lighter);
  color: var(--red-dark);
}

.app-source-check__inner {

  > *:first-child {
    flex: 0 0 16%;
  }

  > *:last-child {
    margin-left: auto;
  }
}

.app-setup-demo {

  .light-text {
    color: var(--tblack-45);
  }
}
</style>
