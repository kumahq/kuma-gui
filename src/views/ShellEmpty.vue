<template>
  <div
    class="overview"
    :class="{ 'overview--simple': $route.meta.simpleContent }"
  >
    <page-header noflex>
      <h2 class="title-3x">
        {{ pageTitle }}
      </h2>
    </page-header>
    <page-content>
      <router-view />
    </page-content>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import PageContent from '@/components/Utils/PageContent.vue'

export default {
  name: 'Shell',
  components: {
    PageHeader,
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

<style lang="scss">
.overview--simple {
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}
</style>
