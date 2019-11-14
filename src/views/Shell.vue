<template>
  <div class="overview">
    <page-header noflex>
      <!-- <Breadcrumbs /> -->
      <h2 class="title-3x">
        {{ this.$route.meta.title }}<span v-if="this.$route.params.mesh"> for &quot;{{ this.$route.params.mesh }}&quot; mesh</span>
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
import Breadcrumbs from '@/components/Breadcrumbs.vue'

export default {
  name: 'Shell',
  components: {
    PageHeader,
    PageContent,
    Breadcrumbs
  },
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  }
}
</script>
