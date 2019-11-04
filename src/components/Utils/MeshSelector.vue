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
        >
          {{ item.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeshSelector',
  props: {
    items: {
      type: Array,
      required: true
    }
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
