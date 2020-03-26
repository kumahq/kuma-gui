<template>
  <div class="wizard">
    <page-header noflex>
      <h2 class="xxl">
        {{ pageTitle }}
      </h2>
    </page-header>
    <div class="wizard__content">
      <p>In order to get started we have to select what network topology we are going to be using.</p>

      <TopologySelector :types="topologies" />
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import TopologySelector from './components/TopologySelector'

export default {
  components: {
    PageHeader,
    TopologySelector
  },
  data () {
    return {
      topologies: [
        {
          name: 'Flat',
          value: 'flat',
          image: 'https://via.placeholder.com/300x150',
          content: 'In this topology, the Mesh assumes a flat network.'
        },
        {
          name: 'Subnets',
          value: 'subnets',
          image: 'https://via.placeholder.com/300x150',
          content: 'In this topology, the Mesh assumes subnets.'
        }
      ]
    }
  },
  computed: {
    pageTitle () {
      const query = this.$route.query

      if (query.type) {
        return `Create a new ${query.type}`
      } else {
        return 'Create a new entity'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wizard {

}

.wizard__content {

}
</style>
