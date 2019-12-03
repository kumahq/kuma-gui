<template>
  <div id="app">
    <global-header
      v-if="!loading && loading !== null"
      :class="{ 'main-header--simple': $route.meta.simpleHeader }"
    />
    <div class="main-content-container">
      <sidebar
        v-if="!loading && loading !== null && !($route.meta.hideSidebar || $route.meta.fullScreen)"
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
        <div class="page">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { setItemToStorage } from '@/Cache'
import { mapState } from 'vuex'
import GlobalHeader from '@/components/Global/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import KLoader from '@/components/KLoader'

export default {
  components: {
    GlobalHeader,
    Sidebar,
    KLoader
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
    })
  },
  beforeMount () {
    // fetch the mesh list
    this.$store.dispatch('fetchMeshList')

    // fetch the version
    // this.$store.dispatch('getVersion')

    // fetch the tagline
    // this.$store.dispatch('getTagline')

    if (!localStorage.getItem('selectedMesh')) {
      setItemToStorage('selectedMesh', this.$store.getters.getSelectedMesh)
    }
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
