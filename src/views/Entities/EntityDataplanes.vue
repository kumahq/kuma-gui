<template>
  <div class="services">
    <page-header>
      <template v-slot:content>
        <div>
          <h2 class="title-3x">
            Services
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
      </template>
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
