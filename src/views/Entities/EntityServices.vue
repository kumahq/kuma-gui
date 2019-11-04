<template>
  <div class="services">
    <p>Services will appear here.</p>
    <p>Service: {{ this.$route.params.service }}</p>
  </div>
</template>

<script>
import DataFilterSearch from '@/components/Utils/DataFilterSearch'

export default {
  name: 'Services',
  metaInfo: {
    title: 'Services'
  },
  components: {
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
