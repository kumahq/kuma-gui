<template>
  <div class="mesh-selector-container">
    <div v-if="items">
      <h3 class="menu-title">
        Filter by Mesh:
      </h3>
      <select
        id="mesh-selector"
        class="mesh-selector"
        name="mesh-selector"
        @change="changeMesh"
      >
        <option
          value="all"
          :selected="'all' === selectedMesh"
        >
          All Meshes
        </option>
        <option
          v-for="item in items.items"
          :key="item.name"
          :value="item.name"
          :selected="item.name === selectedMesh"
        >
          {{ item.name }}
        </option>
      </select>
    </div>
    <KAlert
      v-else
      appearance="danger"
      alert-message="No meshes found!"
    />
  </div>
</template>

<script>
export default {
  name: 'MeshSelector',
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  computed: {
    selectedMesh () {
      const stored = localStorage.getItem('selectedMesh')
      const query = this.$route.params.mesh

      return stored || query
    }
  },
  methods: {
    changeMesh (event) {
      const val = event.target.value

      // update the selected mesh in the store
      this.$store.dispatch('updateSelectedMesh', val)

      // update the localStorage item so that it persists
      localStorage.setItem('selectedMesh', val)

      // update the route accordingly
      if (this.$route.name === 'global-overview') {
        this.$router.push({
          name: 'all-meshes',
          query: { mesh: val }
        })
      } else {
        this.$router.push({
          params: { mesh: val }
        })
      }
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
  display: block;
  font-size: var(--type-sm);
  font-weight: 500;
  color: var(--gray-3);
  // text-transform: uppercase;
  margin: 0 0 5px 0;
}

.closed .mesh-selector-container {
  display: none;
}
</style>
