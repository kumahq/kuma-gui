<template>
  <div class="services">
    <page-header>
      <div>
        <h2 class="title-3x">
          Dataplanes Detail!
        </h2>
      </div>
      <div>
        <form action>
          <label for="service-search">Search:</label>
          <input
            id="service-search"
            type="search"
            name="service-search"
            placeholder="Search..."
          >
        </form>
      </div>
    </page-header>
    <!-- page-header -->
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import MetricTable from '@/components/Metrics/MetricTable.vue'

export default {
  name: 'Dataplanes',
  metaInfo: {
    title: 'Dataplanes'
  },
  components: {
    PageHeader,
    MetricTable
  }
}
</script>

<style>
</style>
