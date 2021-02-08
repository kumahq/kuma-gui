<template>
  <div ref="chart" />
</template>

<script>
import PieChart from '@/mixins/PieChart'

export default {
  name: 'VersionsDonutChart',
  mixins: [PieChart],
  props: {
    titleProps: {
      type: Object,
      default() {
        return { fontSize: 18, fontWeight: '400' }
      },
    },
    subTitleProps: {
      type: Object,
      default() {
        return { fontSize: 12, fontWeight: '300', text: 'VERSIONS' }
      },
    },
    reverseTitles: {
      type: Boolean,
      default: true,
    },
    emptySubTitle: {
      type: String,
      default: 'NOT FOUND',
    },
  },
}
</script>
