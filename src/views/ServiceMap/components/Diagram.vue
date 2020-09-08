<template>
  <h1>Hello World</h1>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

// am4core.useTheme(am4themesAnimated)

export default {
  name: 'ServiceMap',
  props: {
    data: {
      type: Object,
      default: () => null,
      required: true
    }
  },
  mounted () {
    this.setupDiagram()
  },
  methods: {
    setupDiagram () {
      console.log('setting up our diagram...')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
