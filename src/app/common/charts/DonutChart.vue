<template>
  <div ref="chartNode" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createFromConfig } from '@amcharts/amcharts4/core'
import { PieChart } from '@amcharts/amcharts4/charts'

const TitleLabelClassName = 'DonutChart--titleLabel'
const SubTitleLabelClassName = 'DonutChart--sumLabel'
const defaultLabelsColor = 'rgba(41, 11, 83, 0.75)'
const onlineColor = '#19a654'
const offlineColor = '#bf1330'
const partiallyDegradedColor = '#f2a230'

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

const router = useRouter()

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },

  title: {
    type: [String, Object],
    required: true,
  },

  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },

  displayAmChartsLogo: {
    type: Boolean,
    required: false,
    default: false,
  },

  url: {
    type: [String, Object],
    required: false,
    default: null,
  },

  hideSliceLabels: {
    type: Boolean,
    required: false,
    default: false,
  },

  saveChart: {
    type: Boolean,
    required: false,
    default: false,
  },

  titleProps: {
    type: Object,
    required: false,
    default: null,
  },

  subTitleProps: {
    type: Object,
    required: false,
    default: null,
  },

  emptySubTitle: {
    type: String,
    required: false,
    default: 'NO',
  },

  reverseTitles: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const chartNode = ref<HTMLElement | null>(null)
let chart: any
let titleContainer: any
let subTitleLabel: any
let series: any
let titleLabel: any

watch(() => props.data, function () {
  applyData(props.data)
}, { deep: true })

watch(() => props.isLoading, function () {
  if (props.isLoading) {
    series?.hide(0)
    titleContainer?.hide(0)
  } else {
    series?.show()
    titleContainer?.show()
  }
})

onMounted(function () {
  createChart()
  applyData(props.data)
})

onBeforeUnmount(function () {
  chart?.dispose()
})

function applyData(data: any): void {
  if (!chart) {
    return
  }

  if (!data.length) {
    chart.invalidateData()
  }

  chart.data = data
}

function dataAdapter(data: any, chart: any): any {
  if (!data.length) {
    return getEmptyData()
  }

  // If data item includes property 'route' it means it should move user
  //  somewhere, and we'll use router to compute the proper url
  return data
    .map((item: any) => {
      const { route } = item

      const defaultItem = route || chart.url ? { ...item, fillOpacity: 0.7 } : item

      if (route) {
        const { href, meta } = router.resolve(route)
        const { title } = meta

        return {
          url: href,
          urlTitle: title,
          ...defaultItem,
        }
      }

      return defaultItem
    })
    .map((item: any) => {
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
}

function labelRadiusAdapter(_value: any, target: any): number {
  const { fontSize } = target.properties
  const series = target.parent.parent

  const donutThickness = series.pixelRadius - series.pixelInnerRadius

  // Let's make font smaller when donuts become smaller
  series.labels.template.fontSize = Math.ceil(donutThickness / 3)

  return (2 - donutThickness - fontSize) / 2
}

function setTitle(): void {
  const total = props.data.reduce((acc: any, { value }: any) => acc + value, 0)

  if (typeof props.title === 'object' && props.title.singular && props.title.plural) {
    titleLabel.text = total === 1 ? props.title.singular : props.title.plural
  }

  if (typeof props.title === 'string') {
    titleLabel.text = props.title
  }

  titleContainer.invalidateLabels()
}

function dataItemsValidatedHandler() {
  setTitle()

  if (!props.data.length && subTitleLabel.currentText !== props.emptySubTitle) {
    titleLabel.fontWeight = '400'
    titleLabel.fontSize = 13

    subTitleLabel.text = props.emptySubTitle
    subTitleLabel.fontWeight = '400'
    subTitleLabel.fontSize = 13

    titleContainer.invalidateLabels()
  }

  if (props.data.length && subTitleLabel.currentText === props.emptySubTitle) {
    titleLabel.fontWeight = props.titleProps && props.titleProps.fontWeight ? props.titleProps.fontWeight : '400'
    titleLabel.fontSize = props.titleProps && props.titleProps.fontSize ? props.titleProps.fontSize : 13

    subTitleLabel.text = props.subTitleProps && props.subTitleProps.text ? props.subTitleProps.text : '{values.value.sum}'
    subTitleLabel.fontWeight = props.subTitleProps && props.subTitleProps.fontWeight ? props.subTitleProps.fontWeight : '700'
    subTitleLabel.fontSize = props.subTitleProps && props.subTitleProps.fontSize ? props.subTitleProps.fontSize : 22

    titleContainer.invalidateLabels()
  }
}

function createChart(): any {
  if (!(chartNode.value instanceof HTMLElement)) {
    return
  }

  chart = createFromConfig(createDefaultConfig(), chartNode.value, PieChart)

  if (props.saveChart) {
    // We declare these properties on globalThis in index.d.ts
    // once these are gone we can also remove those declarations
    window.chart = chart
    window.series = series
  }

  if (chart.logo) {
    chart.logo.disabled = !props.displayAmChartsLogo

    if (props.displayAmChartsLogo) {
      chart.logo.properties.align = 'right'
    }
  }

  series.labels.template.disabled = props.hideSliceLabels

  if (props.url) {
    chart.url = router.resolve(props.url).href
  }

  if (props.titleProps && titleLabel) {
    for (const prop in props.titleProps) {
      titleLabel[prop] = props.titleProps[prop]
    }
  }

  if (props.subTitleProps && subTitleLabel) {
    for (const prop in props.subTitleProps) {
      subTitleLabel[prop] = props.subTitleProps[prop]
    }
  }

  return chart
}

function createDefaultConfig(): any {
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
            radius: labelRadiusAdapter,
            disabled(value: any, { dataItem }: any) {
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
            callback(this: any) {
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
          callback(this: any) {
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
            callback(this: any) {
              this.toBack()

              titleContainer = this
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
                callback(this: any) {
                  subTitleLabel = this
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
                callback(this: any) {
                  if (props.reverseTitles) {
                    this.toBack()
                  }

                  titleLabel = this

                  setTitle()
                },
              },
            ],
          },
        ],
        callback(this: any) {
          series = this
        },
        events: {
          dataitemsvalidated: dataItemsValidatedHandler,
        },
      },
    ],
    adapter: {
      data: dataAdapter,
    },
  }
}
</script>
