<template>
  <div class="overview">
    <page-header>
      <template v-slot:content>
        <div>
          <h2 class="title-3x">
            Global Overview
          </h2>
        </div>
        <div>
          <form action>
            <label for="overview-timeframe">Timeframe:</label>
            <select
              id="overview-timeframe"
              name="overview-timeframe"
            >
              <option value>
                Last Hour
              </option>
              <option value>
                Option Two
              </option>
              <option value>
                Option Three
              </option>
            </select>
          </form>
        </div>
      </template>
    </page-header>
    <!-- page-header -->

    <div class="metric-box-container">
      <div class="flex -mx-4">
        <metric-box
          v-for="(item, index) in overviewData"
          :key="index"
          class="flex-1 mx-4"
        >
          <template v-slot:title>
            <h3>{{ item.metric }}</h3>
          </template>
          <template v-slot:content>
            <p>{{ shortNum(item.value) }}</p>
          </template>
        </metric-box>
      </div>
    </div>
    <!-- .metric-box-container -->

    <!-- <div class="pills">
      <pill label="mesh-name-01" background="green" color="white"></pill>
      <pill label="mesh-name-02" background="red" color="white"></pill>
      <pill label="mesh-name-03" background="red" color="white"></pill>
      <pill label="finance" background="rebeccapurple" color="white"></pill>
    </div>-->

    <div class="graph-container" />
    <!-- .graph-container -->
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
// import Pill from "@/components/Utils/Pill.vue"
import MetricBox from '@/components/Metrics/MetricBox.vue'
import shortNum from '@/mixins/ShortNum'

export default {
  name: 'Overview',
  components: {
    PageHeader,
    MetricBox
    // Pill
  },
  mixins: [shortNum],
  data () {
    return {
      overviewData: [
        {
          metric: 'Number of Meshes',
          value: '15'
        },
        {
          metric: 'Number of Dataplanes',
          value: '8,011'
        },
        {
          metric: 'Number of Services',
          value: '120'
        },
        {
          metric: 'Total Requests',
          value: '4,584,997,110'
        }
      ]
    }
  }
}
</script>
