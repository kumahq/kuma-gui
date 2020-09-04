<template>
  <div class="service-map">
    <FrameSkeleton padded>
      <p>Use the Service Map to visualize requests flowing through {{ title }}.</p>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'

export default {
  name: 'ServiceMap',
  metaInfo: {
    title: 'Service Map'
  },
  components: {
    FrameSkeleton
  },
  data () {
    return {

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
