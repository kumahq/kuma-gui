<template>
  <div class="metric-table-container">
    <table class="metric-table">
      <thead>
        <tr>
          <th colspan="2">
            <slot name="metric-heading" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
        >
          <td v-if="item.label">
            {{ item.label }}
          </td>
          <td>
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.metric-table-container {
}

.metric-table {
}
</style>
