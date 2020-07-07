<template>
  <div class="overview">
    <page-header noflex>
      <breadcrumbs />
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
  }
}
</script>
