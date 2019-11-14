<template>
  <div
    v-if="isVisible"
    class="entity-skeleton"
  >
    <MetricGrid
      v-if="metrics"
      :metrics="metrics"
    />
    <KTable
      v-if="tableData"
      :options="tableData"
    >
      <template
        v-if="tableActions"
        slot="actions"
        :slot-scope="tableSlotScope"
      >
        <slot />
      </template>
    </KTable>
  </div>
</template>

<script>
import MetricGrid from '@/components/Metrics/MetricGrid.vue'

export default {
  name: 'EntitySkeleton',
  components: [
    MetricGrid
  ],
  props: {
    delayMilliseconds: {
      type: Number,
      required: false,
      default: 750
    },
    metrics: {
      type: Object,
      required: false,
      default: null
    },
    tableData: {
      type: Object,
      required: true
    },
    tableActions: {
      type: Boolean,
      default: false
    },
    tableSlotScope: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      isVisible: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.isVisible = true
    }, this.delayMilliseconds)
  }
}
</script>

<style>

</style>
