<template>
  <div class="mesh-selector-container">
    <div>
      <h3 class="menu-title">
        Meshes
      </h3>
      <select
        id="mesh-selector"
        class="mesh-selector"
        name="mesh-selector"
      >
        <option
          v-for="(item, index) in items"
          :key="index"
          :value="item.name"
          :selected="item.name === selectedMesh"
        >
          {{ item.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MeshSelector',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState(['selectedMesh'])
  }
}
</script>

<style lang="scss" scoped>
.mesh-selector-container {
  padding: 32px 32px 0;
}

.mesh-selector {
  display: block;
  width: 100%;
}

.menu-title {
  font-size: 12px;
  font-weight: normal;
  color: #000;
  text-transform: uppercase;
  padding: 0 0 12px 0;
}

.closed .mesh-selector-container {
  display: none;
}
</style>
