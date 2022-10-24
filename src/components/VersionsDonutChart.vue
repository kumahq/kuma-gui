<template>
  <DonutChart
    v-bind="$attrs"
    :data="data"
    :title="title"
    :is-loading="isLoading"
    :url="url"
    :display-am-charts-logo="displayAmChartsLogo"
    :title-props="props.titleProps"
    :sub-title-props="props.subTitleProps"
    :empty-sub-title="props.emptySubTitle"
    :reverse-titles="props.reverseTitles"
  />
</template>

<script lang="ts" setup>
import DonutChart from './DonutChart.vue'

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

  titleProps: {
    type: Object,
    required: false,
    default: () => ({ fontSize: 18, fontWeight: '400' }),
  },

  subTitleProps: {
    type: Object,
    required: false,
    default: () => ({ fontSize: 12, fontWeight: '300', text: 'VERSIONS' }),
  },

  emptySubTitle: {
    type: String,
    required: false,
    default: 'NOT FOUND',
  },

  reverseTitles: {
    type: Boolean,
    required: false,
    default: true,
  },
})
</script>
