<template>
  <div class="services">
    <page-header>
      <div>
        <h2 class="title-3x">
          Traffic Log
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
  name: 'TrafficLog',
  metaInfo: {
    title: 'Traffic Log'
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
