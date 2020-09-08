<template>
  <div class="diagram-container">
    <div
      ref="diagram"
      class="diagram"
    />
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

// am4core.useTheme(am4themesAnimated)

let chart = null

export default {
  name: 'ServiceMap',
  props: {
    data: {
      type: Array,
      required: true
    },
    fromNamespace: {
      type: String,
      default: 'from'
    },
    toNamespace: {
      type: String,
      default: 'to'
    },
    valueNamespace: {
      type: String,
      default: 'value'
    },
    draggableNodes: {
      type: Boolean,
      default: false
    },
    nodeTooltip: {
      type: String,
      default: 'Click to show/hide or drag to rearrange.'
    }
  },
  mounted () {
    this.setupDiagram()
  },
  beforeDestroy () {

  },
  methods: {
    setupDiagram () {
      const chartRef = this.$refs.diagram

      chart = am4core.create(chartRef, am4charts.ChordDiagram)

      // for external data from an api or json file, use this:
      // chart.dataSource.url = 'some_json.json'

      chart.data = this.data
      chart.dataFields.fromName = this.fromNamespace
      chart.dataFields.toName = this.toNamespace
      chart.dataFields.value = this.valueNamespace

      if (this.draggableNodes) {
        const nodeTemplate = chart.nodes.template

        nodeTemplate.readerTitle = this.nodeTooltip
        nodeTemplate.showSystemTooltip = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
