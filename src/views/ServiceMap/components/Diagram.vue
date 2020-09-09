<template>
  <div class="diagram-container">
    <div
      ref="diagram"
      class="diagram"
      :style="`--chart-height: ${diagramHeight}`"
    />
  </div>
</template>

<script>
import { create, useTheme } from '@amcharts/amcharts4/core'
import { ChordDiagram, SankeyDiagram } from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

useTheme(am4themesAnimated)

export default {
  name: 'ServiceMap',
  props: {
    data: {
      type: Array,
      required: true
    },
    diagramHeight: {
      type: String,
      default: '800px'
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
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    setupDiagram () {
      const chartRef = this.$refs.diagram
      const chart = create(chartRef, ChordDiagram)

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

      this.chart = chart
    }
  }
}
</script>

<style lang="scss" scoped>
.diagram {
  width: 100%;
  height: var(--chart-height);
}
</style>
