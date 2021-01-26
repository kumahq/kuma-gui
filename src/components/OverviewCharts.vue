<template>
  <div
    ref="chart"
    class="flex flex-auto h-64"
  />
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'

const getEmptyData = () => [{
  category: 'Empty',
  disabled: true,
  labelDisabled: true,
  value: 1,
  color: am4core.color('#dadada'),
  opacity: 0.3,
  strokeDasharray: '4,4',
  strokeWidth: 1,
}]

const ZONES_CHART_NAME = 'Zones'
const DATAPLANES_CHART_NAME = 'Dataplanes'
const SERVICES_CHART_NAME = 'Services'

export default {
  name: 'OverviewCharts',
  props: {
    zones: {
      type: Number,
      required: true,
    },
    dataplanes: {
      type: Array,
      required: true,
    },
    services: {
      type: Array,
      required: true,
    },
    selectedMesh: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      charts: {}
    }
  },
  watch: {
    zones (newValue) {
      this.loadDataIntoChart(ZONES_CHART_NAME, newValue)
    },
    dataplanes (newValue) {
      this.loadDataIntoChart(DATAPLANES_CHART_NAME, newValue)
    },
    services (newValue) {
      this.loadDataIntoChart(SERVICES_CHART_NAME, newValue)
    },
    selectedMesh (newValue) {
      const { chart } = this.charts[ZONES_CHART_NAME] || {}

      if (chart && newValue !== 'all') {
        chart.dispose()
      } else {
        this.createZonesChart()
      }
    },
  },
  mounted () {
    this.renderCharts()
  },
  beforeDestroy () {
    if (this.container) {
      this.container.dispose()
    }
  },
  methods: {
    prepareData (chartName, data) {
      switch (chartName) {
        case ZONES_CHART_NAME:
          return [{ category: 'Zone', value: data, labelDisabled: true }]
        case DATAPLANES_CHART_NAME:
          return data.map((item) => {
            switch (item.category) {
              case 'Online':
                return { ...item, color: am4core.color('#19A654') }
              case 'Offline':
                return { ...item, color: am4core.color('#BF1330') }
              case 'Partially degraded':
                return { ...item, color: am4core.color('#F2A230') }
              default:
                return item
            }
          })
        case SERVICES_CHART_NAME:
          return data
      }
    },
    loadDataIntoChart (name, newData, callback) {
      const chartObject = this.charts[name]

      if (!chartObject) {
        return
      }

      const { chart, sumLabel, callbacks } = chartObject
      const data = this.prepareData(name, newData)

      if (!data.length) {
        sumLabel.text = 'Total: 0'
        chart.data = getEmptyData()
        chartObject.data.length = 0
      } else {
        sumLabel.text = 'Total: {values.value.sum}'
        chart.data = chartObject.data = data
      }

      if (callback) {
        callbacks.push(callback)
      }

      callbacks.forEach(cb => cb(chartObject))
    },
    createContainer () {
      const container = am4core.create(this.$refs.chart, am4core.Container)

      this.container = container

      container.width = am4core.percent(100)
      container.height = am4core.percent(100)
      container.layout = 'horizontal'

      return container
    },
    createChart(zIndex = 1) {
      const chart = this.container.createChild(am4charts.PieChart)

      chart.fontSize = 13
      chart.hiddenState.properties.opacity = 0
      chart.radius = am4core.percent(80)
      chart.innerRadius = am4core.percent(55)
      chart.zIndex = zIndex

      return chart
    },
    createSeries (chart) {
      const series = chart.series.push(new am4charts.PieSeries())

      series.dataFields.value = 'value'
      series.dataFields.category = 'category'
      series.colors.step = 2
      series.alignLabels = false
      series.rotation = 180
      series.labels.template.bent = true
      series.labels.template.radius = 3
      series.labels.template.padding(0, 0, 5, 0)
      series.labels.template.text = '{category}: {value}'
      series.labels.template.propertyFields.disabled = 'labelDisabled'
      series.tooltip.disabled = true
      series.ticks.template.disabled = true

      return series
    },
    createSliceTemplate ({ slices }) {
      const { template } = slices

      template.cornerRadius = 0
      template.propertyFields.fill = 'color'
      template.propertyFields.fillOpacity = 'opacity'
      template.propertyFields.stroke = 'color'
      template.propertyFields.strokeDasharray = 'strokeDasharray'
      template.propertyFields.strokeWidth = 'strokeWidth'
      template.strokeWidth = 0
      template.strokeOpacity = 1
      template.fillOpacity = 0.7
      template.states.getKey('hover').properties.scale = 1
      template.states.getKey('active').properties.shiftRadius = 0

      return template
    },
    createSumLabel(series) {
      const sumLabel = series.createChild(am4core.Label)

      sumLabel.horizontalCenter = 'middle'
      sumLabel.verticalCenter = 'middle'
      sumLabel.fontSize = 18
      sumLabel.text = 'Total: {values.value.sum}'
      sumLabel.rotation = 180

      return sumLabel
    },
    createChartTitle (chart, text = '') {
      const title = chart.titles.create()

      title.text = text
      title.fontSize = 18
      title.marginBottom = 0

      return title
    },
    renderChart (name, params = { zIndex: 1 }, callback = () => {}) {
      if (!this.container) {
        return
      }

      const chart = this.createChart(params.zIndex)
      const series = this.createSeries(chart)
      const sliceTemplate = this.createSliceTemplate(series)
      const sumLabel = this.createSumLabel(series)
      const chartTitle = this.createChartTitle(chart, name)

      this.charts[name] = { chart, sliceTemplate, sumLabel, chartTitle, data: [], callbacks: [] }

      callback(this.charts[name])
    },
    createZonesChart () {
      const renderCallback = ({ chart, sliceTemplate }) => {
        chart.toBack()

        sliceTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

        sliceTemplate.states.getKey('hover').properties.fillOpacity = 1

        sliceTemplate.events.on('hit', () => {
          this.$router.push({ name: 'zones', params: { mesh: this.selectedMesh } })
        })
      }

      this.renderChart(ZONES_CHART_NAME, { zIndex: 1 }, renderCallback)
      this.loadDataIntoChart(ZONES_CHART_NAME, this.zones)
    },
    createDataplanesChart () {
      const renderCallback = ({ sliceTemplate }) => {
        sliceTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

        sliceTemplate.events.on('hit', () => {
          this.$router.push(`/${this.selectedMesh}/dataplanes`)
        })
      }

      const loadDataCallback = ({ data, sliceTemplate }) => {
        sliceTemplate.states.getKey('hover').properties.fillOpacity = data.length
          ? 1
          : 0.7
      }

      this.renderChart(DATAPLANES_CHART_NAME, { zIndex: 2 }, renderCallback)
      this.loadDataIntoChart(DATAPLANES_CHART_NAME, this.dataplanes, loadDataCallback)
    },
    createServicesChart () {
      const renderCallback = ({ sliceTemplate }) => {
        sliceTemplate.events.on('hit', (e) => {
          if (!this.charts[SERVICES_CHART_NAME].data.length) {
            return
          }

          let path = ''

          switch (e.target.dataItem.properties.category) {
            case 'Internal':
              path = `/${this.selectedMesh}/internal-services`
              break
            case 'External':
              path = `/${this.selectedMesh}/external-services`
              break
          }

          this.$router.push(path)
        })
      }

      const loadDataCallback = ({ data, sliceTemplate }) => {
        sliceTemplate.states.getKey('hover').properties.fillOpacity = data.length
          ? 1
          : 0.3

        sliceTemplate.cursorOverStyle = data.length
          ? am4core.MouseCursorStyle.pointer
          : am4core.MouseCursorStyle.default
      }

      this.renderChart(SERVICES_CHART_NAME, { zIndex: 3 }, renderCallback)
      this.loadDataIntoChart(SERVICES_CHART_NAME, this.services, loadDataCallback)
    },
    renderCharts () {
      this.createContainer()

      if (this.selectedMesh === 'all') {
        this.createZonesChart()
      }

      this.createDataplanesChart()
      this.createServicesChart()
    },
  },
}
</script>
