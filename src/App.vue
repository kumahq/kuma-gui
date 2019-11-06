<template>
  <div id="app">
    <global-header />
    <div class="main-content-container">
      <sidebar />
      <main class="main-content">
        <div class="page">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GlobalHeader from '@/components/Global/Header'
import Sidebar from '@/components/Sidebar/Sidebar'

export default {
  components: {
    GlobalHeader,
    Sidebar
  },
  metaInfo: {
    title: 'Home',
    titleTemplate: '%s | Kuma',
    htmlAttrs: {
      lang: 'en'
    }
  },
  mounted () {
    // fetch the mesh list
    this.$store.dispatch('fetchMeshList')

    // fetch the dataplanes for the current mesh
    this.$store.dispatch('fetchDataplanesFromMesh')

    // set a localStorage reference for the selected mesh

    /**
     * <select> NOTE:
     *
     * we have to check the $route first and see where the
     * user is at first so we can determine if we should match
     * the mesh value in the <select> to the $route
     */

    if (!localStorage.getItem('selectedMesh')) {
      localStorage.setItem('selectedMesh', this.$store.getters.getSelectedMesh)
    }
  }
}
</script>

<style scoped>
.main-content {
  padding: 44px;
}
</style>
