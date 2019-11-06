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
    this.$store.dispatch('fetchMeshList')
  }
}
</script>

<style scoped>
.main-content {
  padding: 44px;
}
</style>
