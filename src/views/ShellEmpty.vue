<template>
  <div
    class="main-content-container"
  >
    <div class="main-content">
      <div
        class="overview"
      >
        <page-content>
          <transition
            mode="out-in"
            name="fade"
          >
            <router-view />
          </transition>
        </page-content>
      </div>
    </div>
  </div>
</template>

<script>
import PageContent from '@/components/Utils/PageContent.vue'

export default {
  name: 'ShellEmpty',
  components: {
    PageContent
  },
  computed: {
    pageTitle () {
      const title = this.$route.meta.title
      const mesh = this.$route.params.mesh
      const dataplane = this.$route.params.dataplane

      let assembled

      if (dataplane) {
        assembled = `${title} for ${dataplane}`
      } else if (mesh) {
        assembled = `${title} for ${mesh}`
      } else {
        assembled = title
      }

      return assembled
    }
  }
}
</script>
