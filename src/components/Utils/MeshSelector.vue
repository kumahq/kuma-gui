<template>
  <div class="mesh-selector-container">
    <div v-if="items">
      <h3 class="menu-title">
        Meshes
      </h3>
      <select
        id="mesh-selector"
        class="mesh-selector"
        name="mesh-selector"
        @change="changeMesh"
      >
        <!-- <option
          value=""
          disabled
        >
          All (global)
        </option> -->
        <option
          v-for="item in items.items"
          :key="item.name"
          :value="item.name"
          :selected="item.name === ($route.params.mesh ? $route.params.mesh : getMeshFromLocalStorage)"
        >
          {{ item.name }}
        </option>
      </select>
    </div>
    <div v-else>
      <p>No meshes.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MeshSelector',
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  computed: {
    getMeshFromLocalStorage () {
      return localStorage.getItem('selectedMesh')
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
      this.$router.push({
        name: 'mesh-overview',
        params: {
          mesh: val
        }
      })
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
