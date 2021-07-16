<template>
  <div id="app">
    <div
      v-if="loading"
      class="full-screen"
    >
      <KLoader />
    </div>

    <div v-else>
      <GlobalHeader />
      <router-view v-if="status === 'OK'" />
      <main
        v-else
        class="main-content"
      >
        <ApiErrorMessage />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import GlobalHeader from '@/components/Global/Header'

import KLoader from '@/components/KLoader'
import ApiErrorMessage from '@/components/Skeletons/ApiErrorMessage'
export default {
  components: {
    GlobalHeader,
    KLoader,
    ApiErrorMessage,
  },
  metaInfo: {
    title: 'Home',
    titleTemplate: `%s | ${process.env.VUE_APP_NAMESPACE}`,
    htmlAttrs: {
      lang: 'en'
    }
  },
  computed: {
    ...mapState({
      loading: state => state.globalLoading
    }),
    ...mapGetters({
      status: 'config2/getStatus'
    })
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    ...mapActions(['bootstrap'])
  }
}
</script>

<style lang="scss" scoped>
.full-screen {
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
