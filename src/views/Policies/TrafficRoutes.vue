<template>
  <div class="services">
    <page-header>
      <div>
        <h2 class="title-3x">
          Traffic Routes
        </h2>
      </div>
      <div>
        <!-- <DataFilterSearch /> -->
      </div>
    </page-header>
    <page-content />
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader'
import PageContent from '@/components/Utils/PageContent'
import DataFilterSearch from '@/components/Utils/DataFilterSearch'

export default {
  name: 'TrafficRoutes',
  metaInfo: {
    title: 'Traffic Routes'
  },
  components: {
    PageHeader,
    PageContent,
    DataFilterSearch
  },
  data () {
    return {

    }
  }
}
</script>

<style>
</style>
