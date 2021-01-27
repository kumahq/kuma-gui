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
  strokeColor: am4core.color('#dadada'),
  strokeDasharray: '4,4',
  strokeWidth: 2,
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
      type: Object,
      required: true,
    },
    services: {
      type: Array,
      required: true,
    },
    selectedMesh: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      charts: {},
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
          return [
            { category: 'Online', value: data.online, color: am4core.color('#19A654') },
            { category: 'Offline', value: data.offline, color: am4core.color('#BF1330') },
          ].filter(({ value }) => value > 0)
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
        sumLabel.text = `${name}: [bold]0[/]`
        chart.data = getEmptyData()
        chartObject.data.length = 0
      } else {
        sumLabel.text = `[text-transform: uppercase]${name}[/]: [bold]{values.value.sum}[/]`
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
    createChart () {
      const chart = this.container.createChild(am4charts.PieChart)

      chart.fontSize = 13
      chart.hiddenState.properties.opacity = 0
      chart.radius = am4core.percent(95)
      chart.innerRadius = am4core.percent(65)

      return chart
    },
    createSeries (chart) {
      const series = chart.series.push(new am4charts.PieSeries())

      series.dataFields.value = 'value'
      series.dataFields.category = 'category'
      series.colors.step = 2
      series.alignLabels = false
      series.rotation = 180

      series.labels.template.fontWeight = '500'
      series.labels.template.bent = true
      series.labels.template.radius = -25
      series.labels.template.fill = am4core.color('#ffffff')
      series.labels.template.padding(0, 0, 0, 0)
      series.labels.template.text = '{category}'
      // interactionsEnabled sets the label as kind of transparent for events
      //  it's useful for us as we want to catch the click ('hit' in amcharts)
      //  event on series to be able to redirect user to proper subpage,
      //  and without it being set, the label become a 'non clickable' space
      series.labels.template.interactionsEnabled = false
      // pie-chart-label applies some additional styles we want to apply
      //  to our raw label element, see 'style' section of this component
      //  to see which styles this class applies
      series.labels.template.userClassName = 'pie-chart-label'
      series.labels.template.propertyFields.disabled = 'labelDisabled'

      series.ticks.template.disabled = true

      series.tooltip.background.filters.clear()
      series.tooltip.background.strokeWidth = 0

      // initial animation
      series.hiddenState.properties.opacity = 1;
      series.hiddenState.properties.endAngle = -90;
      series.hiddenState.properties.startAngle = -90;

      return series
    },
    createSliceTemplate ({ slices }) {
      const { template } = slices

      template.cornerRadius = 5
      template.propertyFields.fill = 'color'
      template.propertyFields.fillOpacity = 'opacity'
      template.propertyFields.stroke = 'strokeColor'
      template.propertyFields.strokeDasharray = 'strokeDasharray'
      template.propertyFields.strokeWidth = 'strokeWidth'
      template.stroke = am4core.color('#ffffff')
      template.strokeWidth = 2
      template.strokeOpacity = 1
      template.fillOpacity = 0.7
      template.tooltipPosition = 'pointer'
      template.states.getKey('hover').properties.scale = 1
      template.states.getKey('active').properties.shiftRadius = 0

      return template
    },
    createSumLabel (series, name) {
      const sumLabel = series.createChild(am4core.Label)

      sumLabel.horizontalCenter = 'middle'
      sumLabel.verticalCenter = 'middle'
      sumLabel.fontSize = 18
      sumLabel.text = `[text-transform: uppercase]${name}[/]: [bold]{values.value.sum}[/]`
      sumLabel.rotation = 180
      sumLabel.fill = am4core.color('rgba(41, 11, 83, 0.75)')
      sumLabel.pixelPerfect = true
      sumLabel.fontWeight = '400'

      return sumLabel
    },
    renderChart (name, callback = () => {}) {
      if (!this.container) {
        return
      }

      const chart = this.createChart()
      const series = this.createSeries(chart)
      const sliceTemplate = this.createSliceTemplate(series)
      const sumLabel = this.createSumLabel(series, name)

      this.charts[name] = { chart, sliceTemplate, series, sumLabel, data: [], callbacks: [] }

      callback(this.charts[name])
    },
    createZonesChart () {
      const renderCallback = ({ chart, sliceTemplate, series }) => {
        chart.toBack()

        sliceTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

        sliceTemplate.states.getKey('hover').properties.fillOpacity = 1

        series.tooltip.disabled = true

        sliceTemplate.events.on('hit', () => {
          this.$router.push({ name: 'zones', params: { mesh: this.selectedMesh } })
        })
      }

      this.renderChart(ZONES_CHART_NAME, renderCallback)
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

      this.renderChart(DATAPLANES_CHART_NAME, renderCallback)
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

      this.renderChart(SERVICES_CHART_NAME, renderCallback)
      this.loadDataIntoChart(SERVICES_CHART_NAME, this.services, loadDataCallback)
    },
    renderCharts () {
      this.createContainer()

      if (this.selectedMesh === 'all') {
        this.createZonesChart()
      }

      this.createServicesChart()
      this.createDataplanesChart()
    },
  },
}
</script>

<style lang="scss" scoped>
// v-deep is a deep selector which is equivalent of ">>>" as sass loader is not
//  able to properly parse ">>>"
// ref:
//  https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors
::v-deep .pie-chart-label {
  @apply tracking-widest uppercase;
}
</style>
