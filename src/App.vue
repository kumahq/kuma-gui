<template>
  <div id="app">
    <global-header
      v-if="!loading && loading !== null"
      :class="{ 'main-header--simple': $route.meta.simpleHeader }"
    />
    <div class="main-content-container">
      <sidebar
        v-if="!loading && loading !== null && !($route.meta.hideSidebar || $route.meta.fullScreen) && status === 'OK'"
      />
      <div
        v-if="loading"
        class="full-screen"
      >
        <KLoader />
      </div>
      <main
        v-if="!loading && loading !== null"
        class="main-content"
      >
        <div
          v-if="status === 'OK'"
          class="page"
        >
          <OnboardingCheck v-if="showOnboardingCheck" />
          <router-view />
        </div>
        <ApiErrorMessage v-else />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import GlobalHeader from '@/components/Global/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import KLoader from '@/components/KLoader'
import ApiErrorMessage from '@/components/Skeletons/ApiErrorMessage'
import OnboardingCheck from '@/components/Utils/OnboardingCheck'

export default {
  components: {
    GlobalHeader,
    Sidebar,
    KLoader,
    ApiErrorMessage,
    OnboardingCheck
  },
  metaInfo: {
    title: 'Home',
    titleTemplate: '%s | Kuma',
    htmlAttrs: {
      lang: 'en'
    }
  },
  computed: {
    ...mapState({
      loading: state => state.globalLoading
    }),
    ...mapGetters({
      status: 'getStatus'
    }),
    showOnboardingCheck () {
      const route = this.$route.name

      // only show the onboarding check when the user is not
      // currently on any of the onboarding process routes
      return route !== 'setup-welcome' && route !== 'setup-complete'
    }
  },
  watch: {
    '$route' (to, from) {
      this.bootstrap()
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    bootstrap () {
      // check the API status before we do anything else
      this.$store.dispatch('getStatus')
        .then(() => {
          // only dispatch these actions if the API is online
          if (this.$store.getters.getStatus === 'OK') {
            // set the current environment
            this.$store.dispatch('updateEnvironment', localStorage.getItem('kumaEnv'))

            // fetch the mesh list
            this.$store.dispatch('fetchMeshList')

            // fetch the version and store it in localStorage
            this.$store.dispatch('getVersion')
              .then(() => {
                const newVersion = this.$store.getters.getVersion
                const lsVersion = localStorage.getItem('kumaVersion') || null

                // if the version stored in the browser is different than the
                // version running, update the version in localStorage, and
                // reload the page
                if (lsVersion !== newVersion) {
                  // reload the app
                  this.$router.go()

                  // update the version in localStorage
                  localStorage.setItem('kumaVersion', newVersion)
                }
              })

            // fetch the tagline
            this.$store.dispatch('getTagline')

            // fetch the config
            this.$store.dispatch('getConfig')
              .then(() => {
                const mode = this.$store.getters.getConfig.mode

                /**
                 * Set Kuma's current mode in localStorage.
                 * if the mode is `global`, this denotes that it's
                 * running in Multicluster mode.
                 *
                 * This is currently not used anywhere in the app
                 * but we store it anyway for possible future use.
                 * We recommend using VueX's mapGetters and getting
                 * the multicluster status from `getMulticlusterStatus`
                 * (it returns a boolean).
                 */
                localStorage.setItem('kumaMode', mode)
              })

            // set the selected mesh in localStorage
            const mesh = () => {
              const lsMesh = localStorage.getItem('selectedMesh')
              const routeMesh = this.$route.params.mesh || null

              if (routeMesh) {
                // if the `mesh` param is present, use that
                return routeMesh
              } else if (lsMesh && lsMesh !== 'undefined' && lsMesh.length > 0) {
                // or use what's available in localStorage
                return lsMesh
              } else {
                // otherwise, fall back to the default value from our VueX store
                return this.$store.getters.getSelectedMesh
              }
            }

            // set the selected mesh in our VueX store
            this.$store.dispatch('updateSelectedMesh', mesh())

            // update the selected mesh in localStorage
            localStorage.setItem('selectedMesh', mesh())
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  padding: 44px;
  transition: var(--transitionTiming) margin var(--transition);
}

.page {
  max-width: 76rem;
  margin: 0 auto;
}

.main-content-container {
  max-width: var(--global-content-max-width);
  position: relative;
  margin: 0 auto;
}

.full-screen {
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  // bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
