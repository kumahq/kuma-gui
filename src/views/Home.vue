<template>
  <div class="home">
    <page-header>
      <template v-slot:content>
        <div>
          <h2 class="text-4xl">Global Overview</h2>
          <pill label="mesh-name-01" background="red" color="white"></pill>
        </div>
        <div>
          <form action>
            <label for="overview-timeframe">Timeframe:</label>
            <select name="overview-timeframe" id="overview-timeframe">
              <option value>Last Hour</option>
              <option value>Option Two</option>
              <option value>Option Three</option>
            </select>
          </form>
        </div>
      </template>
    </page-header>
    <!-- page-header -->

    <div class="stat-box-container">
      <div class="flex">
        <stat-box class="flex-1" v-for="(item, index) in overviewData" :key="index">
          <template v-slot:title>
            <h3>{{ item.metric }}</h3>
          </template>
          <template v-slot:content>
            <p>{{ item.value }}</p>
          </template>
        </stat-box>
      </div>
    </div>
    <!-- .stat-box-container -->

    <div class="graph-container"></div>
    <!-- .graph-container -->
  </div>
</template>

<script>
import PageHeader from "@/components/Utils/PageHeader.vue";
import Pill from "@/components/Utils/Pill.vue";
import StatBox from "@/components/Stats/StatBox.vue";

export default {
  name: "home",
  data() {
    return {
      overviewData: [
        {
          metric: "Number of Meshes",
          value: "15"
        },
        {
          metric: "Number of Dataplanes",
          value: "8,011"
        },
        {
          metric: "Number of Services",
          value: "120"
        },
        {
          metric: "Total Requests",
          value: "4,584,997,110"
        }
      ]
    };
  },
  components: {
    PageHeader,
    StatBox,
    Pill
  }
};
</script>
