<template>
  <div class="service-map">
    <FrameSkeleton padded>
      <p>Use the Service Map to visualize requests flowing through {{ title }}.</p>
      <div class="service-map-wrapper">
        <Diagram :data="diagramData" />
      </div>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import Diagram from '../components/Diagram'

export default {
  name: 'ServiceMap',
  metaInfo: {
    title: 'Service Map'
  },
  components: {
    FrameSkeleton,
    Diagram
  },
  data () {
    return {
      // fake data for testing
      diagramData: [
        { from: 'A', to: 'D', value: 10 },
        { from: 'B', to: 'D', value: 8 },
        { from: 'B', to: 'E', value: 4 },
        { from: 'B', to: 'C', value: 2 },
        { from: 'C', to: 'E', value: 14 },
        { from: 'E', to: 'D', value: 8 },
        { from: 'C', to: 'A', value: 4 },
        { from: 'G', to: 'A', value: 7 },
        { from: 'D', to: 'B', value: 1 }
      ]
    }
  },
  computed: {
    ...mapGetters({
      title: 'getTagline',
      selectedMesh: 'getSelectedMesh'
    })
  },
  methods: {

  }

}
</script>

<style lang="scss" scoped>
</style>
