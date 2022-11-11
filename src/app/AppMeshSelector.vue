<template>
  <div class="mesh-selector-container">
    <label for="mesh-selector">
      <span class="kutil-sr-only">
        Filter by mesh:
      </span>

      <select
        id="mesh-selector"
        class="mesh-selector"
        name="mesh-selector"
        data-testid="mesh-selector"
        @change="changeMesh"
      >
        <option
          v-for="mesh in props.meshes"
          :key="mesh.name"
          :value="mesh.name"
          :selected="mesh.name === selectedMesh"
        >
          {{ mesh.name }}
        </option>
      </select>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useStore } from '@/store/store'
import { Mesh } from '@/types/index.d'

const route = useRoute()
const router = useRouter()
const store = useStore()

const props = defineProps({
  meshes: {
    type: Array as PropType<Mesh[]>,
    required: true,
  },
})

const selectedMesh = computed(() => store.state.selectedMesh === null ? props.meshes[0].name : store.state.selectedMesh)

function changeMesh(event: Event): void {
  const select = event.target as HTMLSelectElement
  const mesh = select.value

  store.dispatch('updateSelectedMesh', mesh)

  const name = 'mesh' in route.params ? route.name as string : 'mesh-detail-view'

  router.push({ name, params: { mesh } })
}
</script>

<style lang="scss" scoped>
.mesh-selector-container {
  margin-left: var(--spacing-xs);
  margin-top: var(--spacing-xxs);
}

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
