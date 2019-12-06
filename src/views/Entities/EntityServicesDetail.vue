<template>
  <div class="services">
    <page-header>
      <div>
        <h2 class="xxl">
          Service Details
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
    <page-content />
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader'
import PageContent from '@/components/Utils/PageContent'

export default {
  name: 'ServicesDetail',
  metaInfo: {
    title: 'Services Detail'
  },
  components: {
    PageHeader,
    PageContent
  },
  data () {
    return {

    }
  }
}
</script>

<style>
</style>
