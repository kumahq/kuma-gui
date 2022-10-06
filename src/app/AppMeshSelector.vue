<template>
  <div class="px-4 pb-4">
    <div v-if="items">
      <h3 class="menu-title uppercase">
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
          :selected="'all' === store.state.selectedMesh"
        >
          All Meshes
        </option>

        <option
          v-for="item in items.items"
          :key="item.name"
          :value="item.name"
          :selected="item.name === store.state.selectedMesh"
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

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { KAlert } from '@kong/kongponents'

import { useStore } from '@/store/store'

const route = useRoute()
const router = useRouter()
const store = useStore()

defineProps({
  items: {
    type: Object,
    required: true,
  },
})

function changeMesh(event: Event): void {
  const select = event.target as HTMLSelectElement
  const mesh = select.value

  store.dispatch('updateSelectedMesh', mesh)

  router.push({
    name: route.name as string,
    params: 'mesh' in route.params ? { mesh } : undefined,
  })
}
</script>

<style lang="scss" scoped>
.mesh-selector {
  display: block;
  width: 100%;
  color: var(--MeshSelectorInputTextColor);
  border-color: var(--MeshSelectorInputBorderColor);
  outline: none;

  &:focus,
  &:active {
    border-color: var(--MeshSelectorInputBorderColorFocus);
  }
}

.menu-title {
  display: block;
  font-size: var(--type-sm);
  font-weight: 500;
  color: var(--MeshSelectorTitleColor);
  margin: 0 0 5px 0;
}
</style>
