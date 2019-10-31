<template>
  <div class="services">
    <page-header>
      <div>
        <h2 class="title-3x">
          Dataplanes
        </h2>
      </div>
      <div>
        <DataFilterSearch />
      </div>
    </page-header>
    <page-content>
      <router-view />
    </page-content>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader'
import PageContent from '@/components/Utils/PageContent'
import MetricTable from '@/components/Metrics/MetricTable'
import DataFilterSearch from '@/components/Utils/DataFilterSearch'

export default {
  name: 'Dataplanes',
  metaInfo: {
    title: 'Dataplanes'
  },
  components: {
    PageHeader,
    PageContent,
    MetricTable,
    DataFilterSearch
  }
}
</script>

<style>
</style>
