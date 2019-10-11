<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <stat-table :items="items">
      <template v-slot:stat-heading>Statistics Information</template>
    </stat-table>
  </div>
</template>

<script>
import StatTable from "@/components/Stats/StatTable.vue";

export default {
  name: "home",
  data() {
    return {
      items: [
        {
          label: "Item Label 1",
          value: "Item Value 1"
        },
        {
          label: "Item Label 2",
          value: "Item Value 2"
        },
        {
          label: "Item Label 3",
          value: "Item Value 3"
        }
      ]
    };
  },
  components: {
    StatTable
  }
};
</script>
