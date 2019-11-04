<template>
  <div class="overview">
    <page-header noflex>
      <div v-if="this.$route.meta.breadcrumbs">
        <p>Breadcrumbs display here if true</p>
      </div>
      <h2 class="title-3x">
        {{ this.$route.meta.title }}
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
  }
}
</script>
