<template>
  <div class="stat-table-container">
    <table class="stat-table">
      <thead>
        <tr>
          <th colspan="2">
            <slot name="stat-heading"></slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td v-if="item.label">{{ item.label }}</td>
          <td>{{ item.value }}</td>
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
};
</script>

<style lang="scss">
.stat-table-container {
}

.stat-table {
}
</style>
