<template>
  <KCard class="diagram-container">
    <template slot="body">
      <div class="diagram-controls mb-4">
        <div>
          <h4>{{ cardTitle }}</h4>
        </div>
        <div class="diagram-controls__controls">
          <KButton
            appearance="primary"
            size="small"
            :disabled="isLoading"
            @click="refreshDiagram"
          >
            <span>
              <RefreshIcon
                class="refresh-icon-component"
                :class="{ 'is-spinning': isLoading }"
              />
            </span>
            <span>
              {{ refreshButtonText }}
            </span>
          </KButton>
        </div>
      </div>
      <div
        ref="donutDiagram"
        class="donut-diagram"
        :style="`--chart-height: ${diagramHeight}`"
      />
    </template>
  </KCard>
</template>

<script>
import { create, useTheme, percent, color } from '@amcharts/amcharts4/core'
import { PieChart, PieSeries } from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import RefreshIcon from '@/components/Utils/RefreshIcon'

useTheme(am4themesAnimated)

export default {
  name: 'DonutChart',
  components: {
    RefreshIcon
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    cardTitle: {
      type: String,
      required: false,
      default: null
    },
    diagramHeight: {
      type: String,
      default: '800px'
    },
    valueNamespace: {
      type: String,
      default: 'value'
    },
    keyNamespace: {
      type: String,
      default: 'key'
    },
    strokeColor: {
      type: String,
      default: '#fff'
    },
    animate: {
      type: Boolean,
      default: true
    },
    refreshButtonText: {
      type: String,
      default: 'Refresh'
    }
  },
  data () {
    return {
      isLoading: false
    }
  },
  mounted () {
    this.setupDiagram()
  },
  beforeDestroy () {
    this.disposeDiagram()
  },
  methods: {
    refreshDiagram () {
      const promise = new Promise((resolve, reject) => {
        if (this.chart) {
          // dispose of the old chart before reloading it
          this.disposeDiagram()
          this.isLoading = true

          resolve()
        } else {
          const error = new Error('There was no chart present to dispose of!')

          reject(error)
        }
      })

      // destroy the old chart and create anew!
      promise
        .then(() => {
          this.setupDiagram()

          // finish the loading animation once the data has been loaded and validated
          this.chart.events.on('datavalidated', () => {
            this.isLoading = false
          })
        })

      this.$emit('refreshDiagram')
    },
    disposeDiagram () {
      if (this.chart) {
        this.chart.dispose()
        this.$emit('destroyDiagram')
      }
    },
    setupDiagram () {
      const chartRef = this.$refs.donutDiagram
      const chart = create(chartRef, PieChart)

      // TODO we will have to transform the endpoint data accordingly
      // to match what amCharts expects.
      chart.data = this.data

      // set the inner radius
      chart.innerRadius = percent(50)

      // add and configure our Series
      const pieSeries = chart.series.push(new PieSeries())

      // data structure and key/value naming
      pieSeries.dataFields.value = this.valueNamespace
      pieSeries.dataFields.category = this.keyNamespace

      // pie slice styling
      const sliceTemplate = pieSeries.slices.template

      sliceTemplate.stroke = color(this.strokeColor)
      sliceTemplate.strokeWidth = 2
      sliceTemplate.strokeOpacity = 1

      // animation
      if (this.animate) {
        const animationProps = pieSeries.hiddenState.properties

        animationProps.opacity = 1
        animationProps.endAngle = -90
        animationProps.startAngle = -90
      }

      this.chart = chart

      this.$emit('setupDiagram')
    }
  }
}
</script>

<style lang="scss" scoped>
.donut-diagram {
  width: 100%;
  height: var(--chart-height);
}

.refresh-icon-component.is-spinning g {
  animation: spin 1.2s infinite linear;
}

.diagram-controls {
  display: flex;
  align-items: center;

  h4 {
    font-size: var(--type-lg);
    font-weight: 500;
    color: var(--black-85);
  }
}

.diagram-controls__controls {
  margin-left: auto;

  button:after {
    display: none !important;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(1turn); }
}
</style>
