import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      vitalsLoading: null,
      timeFrame: {},
      isUtc: null,
      killPolling: null,
      labelTemplate: () => {}
    }
  },

  computed: {
    ...mapGetters({
      config: 'infoConfig',
      visibilityState: 'visibilityState'
    }),

    chartKeys () {
      return Object.keys(this.charts)
    },

    urls () {
      return this.chartKeys.map((chartKey) => this.charts[chartKey].url)
    },

    vitalsEnabled () {
      return this.config.vitals
    }
  },

  watch: {
    vitalsEnabled: {
      handler () {
        // This is the initial call to get data, it occurs when vitals config is resolved
        // from vuex
        return this.fetchData()
      }
    },

    timeFrame: {
      handler () {
        return this.fetchData()
      }
    },

    visibilityState: {
      handler () {
        if (this.visibilityState === 'visible' && this.vitalsEnabled) {
          return this.fetchData()
        }

        return this.teardownPolling()
      }
    }
  },

  beforeDestroy () {
    // remove polling interval
    this.teardownPolling()
  },

  methods: {
    setRawData (rawData, url) {
      this.chartKeys.forEach(chartKey => {
        const currentChart = this.charts[chartKey]
        if (currentChart.url === url) {
          currentChart.rawData = rawData
        }
      })
    },

    updateControls (key, value) {
      this[key] = value
    },

    fetchData () {
      this.setPolling()

      // trigger loading animation
      this.vitalsLoading = true

      // Copy timeframe param locally. We will compare it to the
      // current timeFrame after we have a response.
      // If they do not match, the timeFrame has changed before
      // the response returned. We will discard the data
      // In this case
      const interval = this.timeFrame.param

      const endTimestamp = Math.floor(moment().unix() / this.timeFrame.stepSize) * this.timeFrame.stepSize
      const startTimestamp = endTimestamp - this.timeFrame.timeFrameLength

      return Promise.all(this.urls.map(dataUrl => {
        return Promise.resolve()
          .then(() => {
            // Do not call endpoint if vitals is disabled.
            if (!this.vitalsEnabled) {
              return
            }

            // Otherwise, call vitals
            const opt = {
              start_ts: startTimestamp,
              interval
            }

            return this.$api.getVitals(dataUrl, opt, this.workspace && this.workspace.name)
              .then(response => response.data)
              .catch((err) => {
                console.debug('vitals returned err: ', err)
              })
          })
          .then(rawData => {
            // if param has not changed before response, assign the data to rawData
            if (rawData && rawData.meta && interval === this.timeFrame.param) {
              rawData.meta.clientEndTimestamp = endTimestamp
              rawData.meta.clientStartTimestamp = startTimestamp
              this.setRawData(rawData, dataUrl)
            }
          })
      }))
        .then(() => {
        // cancel loading animation
          this.vitalsLoading = false
        })
    },

    setPolling () {
      this.teardownPolling()
      if (this.timeFrame && this.timeFrame.refreshInterval) {
        this.killPolling = setTimeout(this.fetchData, this.timeFrame.refreshInterval)
      }
    },

    teardownPolling () {
      clearTimeout(this.killPolling)
      this.killPolling = null
    }
  }

}
