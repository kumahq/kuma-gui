<template>
  <div class="flex flex-auto flex-col">
    <div
      ref="chart"
      class="flex flex-auto h-64"
    />
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'

const getEmptyData = () => [{
  category: 'Empty',
  disabled: true,
  value: 1,
  color: am4core.color('#dadada'),
  opacity: 0.3,
  strokeDasharray: '4,4',
  strokeWidth: 1,
}]

export default {
  name: 'OverviewCharts',
  props: {
    dataplanes: {
      type: Array,
      default() {
        return []
      },
    },
    services: {
      type: Array,
      default() {
        return []
      },
    },
    selectedMesh: {
      type: String,
      default() {
        return 'default'
      }
    }
  },
  watch: {
    dataplanes () {
      if (this.dataplanesChart && this.dataplanesChart.data !== this.dataplanes) {
        this.loadDataplanesData()
      }
    },
    services () {
      if (this.servicesChart && this.servicesChart.data !== this.services) {
        this.loadServicesData()
      }
    },
  },
  mounted () {
    this.renderCharts()
  },
  beforeDestroy () {
    this.disposeCharts()

    if (this.container) {
      this.container.dispose()
    }
  },
  methods: {
    disposeCharts () {
      if (this.dataplanesChart) {
        this.dataplanesChart.dispose()
      }

      if (this.servicesChart) {
        this.servicesChart.dispose()
      }
    },
    getChartsDataSum (data) {
      return data.reduce((acc, { category, value }) => {
        return category === 'Empty'
          ? acc
          : acc + value
      }, 0)
    },
    loadDataplanesData () {
      const sum = this.getChartsDataSum(this.dataplanes)

      this.dataplanesSumLabel.text = sum === 0
        ? 'Total: 0'
        : 'Total: {values.value.sum}'

      this.dataplanesSliceTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

      this.dataplanesSliceTemplate.states.getKey('hover').properties.fillOpacity = sum === 0
        ? 0.7
        : 1

      this.dataplanesChart.data = sum === 0
        ? getEmptyData()
        : this.dataplanes.filter(({ value }) => value > 0)
    },
    loadServicesData () {
      const sum = this.getChartsDataSum(this.services)

      this.servicesSumLabel.text = sum === 0
        ? 'Total: 0'
        : 'Total: {values.value.sum}'

      this.servicesSliceTemplate.cursorOverStyle = sum === 0
        ? am4core.MouseCursorStyle.default
        : am4core.MouseCursorStyle.pointer

      this.servicesSliceTemplate.states.getKey('hover').properties.fillOpacity = sum === 0
        ? 0.3
        : 1

      this.servicesChart.data = sum === 0
        ? getEmptyData()
        : this.services
    },
    createChart (container, title) {
      const chart = container.createChild(am4charts.PieChart)

      chart.fontSize = 13
      chart.hiddenState.properties.opacity = 0
      chart.radius = am4core.percent(80)
      chart.innerRadius = am4core.percent(55)
      chart.zIndex = 1

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
      series.labels.template.propertyFields.disabled = 'disabled'
      series.tooltip.disabled = true
      series.ticks.template.disabled = true

      const sliceTemplate = series.slices.template

      sliceTemplate.cornerRadius = 0
      sliceTemplate.propertyFields.fill = 'color'
      sliceTemplate.propertyFields.fillOpacity = 'opacity'
      sliceTemplate.propertyFields.stroke = 'color'
      sliceTemplate.propertyFields.strokeDasharray = 'strokeDasharray'
      sliceTemplate.propertyFields.strokeWidth = 'strokeWidth'
      sliceTemplate.strokeWidth = 0
      sliceTemplate.strokeOpacity = 1
      sliceTemplate.fillOpacity = 0.7
      sliceTemplate.states.getKey('hover').properties.scale = 1
      sliceTemplate.states.getKey('active').properties.shiftRadius = 0

      const sumLabel = series.createChild(am4core.Label)

      sumLabel.horizontalCenter = 'middle'
      sumLabel.verticalCenter = 'middle'
      sumLabel.fontSize = 18
      sumLabel.text = 'Total: {values.value.sum}'
      sumLabel.rotation = 180

      const dataplanesTitle = chart.titles.create()

      dataplanesTitle.text = title
      dataplanesTitle.fontSize = 18
      dataplanesTitle.marginBottom = 0

      return [chart, series, sliceTemplate, sumLabel]
    },
    createContainer () {
      const container = am4core.create(this.$refs.chart, am4core.Container)

      this.container = container

      container.width = am4core.percent(100)
      container.height = am4core.percent(100)
      container.layout = 'horizontal'

      return container
    },
    renderCharts () {
      const container = this.createContainer()

      const [
        dataplanesChart,
        dataplanesSeries,
        dataplanesSliceTemplate,
        dataplanesSumLabel,
      ] = this.createChart(container, 'Dataplanes')

      this.dataplanesChart = dataplanesChart
      this.dataplanesSeries = dataplanesSeries
      this.dataplanesSliceTemplate = dataplanesSliceTemplate
      this.dataplanesSumLabel = dataplanesSumLabel

      dataplanesSliceTemplate.events.on('hit', () => {
        this.$router.push(`/${this.selectedMesh}/dataplanes`)
      })

      this.loadDataplanesData()

      const [
        servicesChart,
        serviceSeries,
        servicesSliceTemplate,
        servicesSumLabel
      ] = this.createChart(container, 'Services')

      this.servicesChart = servicesChart
      this.serviceSeries = serviceSeries
      this.servicesSliceTemplate = servicesSliceTemplate
      this.servicesSumLabel = servicesSumLabel

      servicesSliceTemplate.events.on('hit', (e) => {
        if (!this.getChartsDataSum(this.services)) {
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

      this.loadServicesData()
    },
  },
}
</script>
