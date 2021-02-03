<template>
  <div ref="chart" />
</template>

<script>
import PieChart from '@/mixins/PieChart'

export default {
  name: 'DonutChart',
  mixins: [PieChart],
}
</script>
