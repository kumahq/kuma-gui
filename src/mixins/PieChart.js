// TODO: Typescript

import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import { applyPropsToObject } from '@/helpers'

const TitleLabelClassName = 'DonutChart--titleLabel'
const SubTitleLabelClassName = 'DonutChart--sumLabel'
const defaultLabelsColor = 'rgba(41, 11, 83, 0.75)'
const onlineColor = '#19A654'
const offlineColor = '#BF1330'
const partiallyDegradedColor = '#F2A230'

const getEmptyData = () => [
  {
    category: 'Empty',
    disabled: true,
    labelDisabled: true,
    tooltipDisabled: true,
    value: 1,
    fill: '#dadada',
    fillOpacity: 0.3,
    strokeColor: '#dadada',
    strokeDasharray: '4,4',
    strokeWidth: 2,
  },
]

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    displayAmChartsLogo: {
      type: Boolean,
    },
    url: {
      type: [String, Object],
      default: null,
    },
    title: {
      type: [String, Object],
      required: true,
    },
    subtitle: {
      type: String,
    },
    hideSliceLabels: {
      type: Boolean,
    },
    emptySubTitle: {
      type: String,
      default: 'NO',
    },
    reverseTitles: {
      type: Boolean,
    },
    subTitleProps: {
      type: Object,
    },
    titleProps: {
      type: Object,
    },
    isLoading: {
      type: Boolean,
    },
    saveChart: {
      type: Boolean,
    },
  },
  data() {
    return {
      labels: [],
    }
  },
  computed: {
    defaultConfig() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this

      return {
        startAngle: 0,
        endAngle: 360,
        radius: '90%',
        innerRadius: '60%',
        data: getEmptyData(),
        series: [
          {
            type: 'PieSeries',
            dataFields: {
              value: 'value',
              category: 'category',
            },
            colors: {
              step: 2,
            },
            alignLabels: false,
            labels: {
              fontWeight: '500',
              fontSize: 11,
              bent: true,
              radius: 0,
              verticalCenter: 'middle',
              fill: '#ffffff',
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              text: '{category}',
              interactionsEnabled: false,
              userClassName: 'pie-chart-label',
              propertyFields: {
                disabled: 'labelDisabled',
              },
              adapter: {
                radius: this.labelRadiusAdapter,
                disabled(value, { dataItem }) {
                  if (dataItem) {
                    const minSize = dataItem.dataContext.minSizeForLabel || 0.1

                    return dataItem.values.value.percent / 100 < minSize
                  }

                  return value
                },
              },
            },
            ticks: {
              disabled: true,
            },
            tooltip: {
              pointerOrientation: 'down',
              background: {
                callback() {
                  // Removing shadow behind the tooltip
                  this.filters.clear()
                },
                strokeWidth: 0,
                // Removing pointer (triangle) from the tooltips
                pointerBaseWidth: 0,
              },
              propertyFields: {
                disabled: 'tooltipDisabled',
              },
            },
            hiddenState: {
              properties: {
                opacity: 1,
                startAngle: -90,
                endAngle: -90,
              },
            },
            slices: {
              cornerRadius: 5,
              propertyFields: {
                fill: 'fill',
                fillOpacity: 'fillOpacity',
                stroke: 'strokeColor',
                strokeDasharray: 'strokeDasharray',
                strokeWidth: 'strokeWidth',
                url: 'url',
              },
              stroke: '#ffffff',
              strokeWidth: 2,
              strokeOpacity: 1,
              tooltipPosition: 'pointer',
              callback() {
                this.states.getKey('hover').properties.scale = 1
                this.states.getKey('active').properties.shiftRadius = 0
                this.states.getKey('hover').properties.fillOpacity = 1
              },
            },
            children: [
              {
                type: 'Container',
                forceCreate: true,

                horizontalCenter: 'middle',
                verticalCenter: 'middle',
                layout: 'vertical',
                background: {
                  fill: '#ffffff',
                },
                callback() {
                  this.toBack()

                  self.titleContainer = this
                },
                children: [
                  {
                    type: 'Label',
                    forceCreate: true,

                    fontSize: 22,
                    fill: defaultLabelsColor,
                    text: '{values.value.sum}',
                    horizontalCenter: 'middle',
                    verticalCenter: 'middle',
                    fontWeight: '700',
                    userClassName: SubTitleLabelClassName,
                    callback() {
                      self.subTitleLabel = this
                    },
                  },
                  {
                    type: 'Label',
                    forceCreate: true,

                    fontSize: 13,
                    fill: defaultLabelsColor,
                    text: 'TOTAL',
                    horizontalCenter: 'middle',
                    verticalCenter: 'middle',
                    fontWeight: '400',
                    userClassName: TitleLabelClassName,
                    callback() {
                      if (self.reverseTitles) {
                        this.toBack()
                      }

                      self.titleLabel = this

                      self.setTitle()
                    },
                  },
                ],
              },
            ],
            callback() {
              self.series = this
            },
            events: {
              dataitemsvalidated: this.dataItemsValidatedHandler.bind(this),
            },
          },
        ],
        adapter: {
          data: this.dataAdapter.bind(this),
        },
      }
    },
  },
  watch: {
    data(newData) {
      this.applyData(newData)
    },
    isLoading(isLoading) {
      if (isLoading) {
        this.series?.hide(0)
        this.titleContainer?.hide(0)
      } else {
        this.series?.show()
        this.titleContainer?.show()
      }
    },
  },
  beforeDestroy() {
    this.chart?.dispose()
  },
  mounted() {
    this.createChart()
    this.applyData(this.data)
  },
  methods: {
    applyData(data) {
      if (!this.chart) {
        return
      }

      if (!data.length) {
        this.chart.invalidateData()
      }

      this.chart.data = data
    },
    dataAdapter(data, chart) {
      if (!data.length) {
        return getEmptyData()
      }

      // If data item includes property 'route' it means it should move user
      //  somewhere, and we'll use router to compute the proper url
      return data
        .map(item => {
          const { route } = item

          const defaultItem = route || chart.url ? { ...item, fillOpacity: 0.7 } : item

          if (route) {
            const { href, resolved } = this.$router.resolve(route)
            const { title } = resolved.meta

            return {
              url: href,
              urlTitle: title,
              ...defaultItem,
            }
          }

          return defaultItem
        })
        .map(item => {
          const { category = '' } = item

          switch (category.toLowerCase()) {
            case 'online':
              return { fill: onlineColor, minSizeForLabel: 0.13, ...item }
            case 'offline':
              return { fill: offlineColor, minSizeForLabel: 0.14, ...item }
            case 'partially degraded':
              return { fill: partiallyDegradedColor, minSizeForLabel: 0.3, ...item }
            default:
              return item
          }
        })
    },
    labelRadiusAdapter(value, target) {
      const { fontSize } = target.properties
      const series = target.parent.parent

      const donutThickness = series.pixelRadius - series.pixelInnerRadius

      // Let's make font smaller when donuts become smaller
      series.labels.template.fontSize = Math.ceil(donutThickness / 3)

      return (2 - donutThickness - fontSize) / 2
    },
    setTitle() {
      const total = this.data.reduce((acc, { value }) => acc + value, 0)

      if (typeof this.title === 'object' && this.title.singular && this.title.plural) {
        this.titleLabel.text = total === 1 ? this.title.singular : this.title.plural
      }

      if (typeof this.title === 'string') {
        this.titleLabel.text = this.title
      }

      this.titleContainer.invalidateLabels()
    },
    dataItemsValidatedHandler() {
      this.setTitle()

      if (!this.data.length && this.subTitleLabel.currentText !== this.emptySubTitle) {
        this.titleLabel.fontWeight = '400'
        this.titleLabel.fontSize = 13

        this.subTitleLabel.text = this.emptySubTitle
        this.subTitleLabel.fontWeight = '400'
        this.subTitleLabel.fontSize = 13

        this.titleContainer.invalidateLabels()
      }

      if (this.data.length && this.subTitleLabel.currentText === this.emptySubTitle) {
        this.titleLabel.fontWeight = this.titleProps && this.titleProps.fontWeight ? this.titleProps.fontWeight : '400'
        this.titleLabel.fontSize = this.titleProps && this.titleProps.fontSize ? this.titleProps.fontSize : 13

        this.subTitleLabel.text =
          this.subTitleProps && this.subTitleProps.text ? this.subTitleProps.text : '{values.value.sum}'
        this.subTitleLabel.fontWeight =
          this.subTitleProps && this.subTitleProps.fontWeight ? this.subTitleProps.fontWeight : '700'
        this.subTitleLabel.fontSize =
          this.subTitleProps && this.subTitleProps.fontSize ? this.subTitleProps.fontSize : 22

        this.titleContainer.invalidateLabels()
      }
    },
    createChart() {
      this.chart = am4core.createFromConfig(this.defaultConfig, this.$refs.chart, am4charts.PieChart)

      if (this.saveChart) {
        window.chart = this.chart
        window.series = this.series
      }

      if (this.chart.logo) {
        this.chart.logo.disabled = !this.displayAmChartsLogo

        if (this.displayAmChartsLogo) {
          this.chart.logo.properties.align = 'right'
        }
      }

      this.series.labels.template.disabled = this.hideSliceLabels

      if (this.url) {
        this.chart.url = this.$router.resolve(this.url).href
      }

      if (this.titleProps && this.titleLabel) {
        applyPropsToObject(this.titleProps, this.titleLabel)
      }

      if (this.subTitleProps && this.subTitleLabel) {
        applyPropsToObject(this.subTitleProps, this.subTitleLabel)
      }

      return this.chart
    },
  },
}
