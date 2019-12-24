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
          <router-view />
        </div>
        <ApiErrorMessage v-else />
      </main>
    </div>
  </div>
</template>

<script>
import { setItemToStorage } from '@/Cache'
import { mapState, mapGetters } from 'vuex'
import GlobalHeader from '@/components/Global/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import KLoader from '@/components/KLoader'
import ApiErrorMessage from '@/components/Skeletons/ApiErrorMessage'

export default {
  components: {
    GlobalHeader,
    Sidebar,
    KLoader,
    ApiErrorMessage
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
    })
  },
  beforeMount () {
    // check the API status before we do anything else
    this.$store.dispatch('getStatus')
      .then(() => {
        // only dispatch these actions if the API is online
        if (this.$store.getters.getStatus === 'OK') {
          // fetch the mesh list
          this.$store.dispatch('fetchMeshList')

          // fetch all dataplanes
          this.$store.dispatch('getAllDataplanes')

          // fetch the version
          this.$store.dispatch('getVersion')

          // fetch the tagline
          this.$store.dispatch('getTagline')

          // set the selected mesh in localStorage
          setItemToStorage('selectedMesh', this.$store.getters.getSelectedMesh)
        }
      })
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  padding: 44px;
}

.full-screen {
  background: #fff;
  position: fixed;
  top: 4rem;
  bottom: 0;
  width: 100%;
  z-index: 50000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
