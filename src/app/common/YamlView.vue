<template>
  <div class="yaml-view">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock v-else-if="hasError" />

    <EmptyBlock v-else-if="isEmpty" />

    <div
      v-else
      class="yaml-view-content"
    >
      <KTabs
        :key="environment"
        v-model="activeTabHash"
        :tabs="tabs"
      >
        <template #universal>
          <CodeBlock
            :id="id"
            language="yaml"
            :code="yamlContent.universal"
            :is-searchable="isSearchable"
            :query-key="id"
            :code-max-height="codeMaxHeight"
          />
        </template>

        <template #kubernetes>
          <CodeBlock
            :id="id"
            language="yaml"
            :code="yamlContent.kubernetes"
            :is-searchable="isSearchable"
            :query-key="id"
            :code-max-height="codeMaxHeight"
          />
        </template>
      </KTabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import json2yaml from '@appscode/json2yaml'
import { KTabs } from '@kong/kongponents'

import { useStore } from '@/store/store'
import CodeBlock from './CodeBlock.vue'
import EmptyBlock from './EmptyBlock.vue'
import ErrorBlock from './ErrorBlock.vue'
import LoadingBlock from './LoadingBlock.vue'

const store = useStore()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },

  content: {
    type: Object,
    required: false,
    default: null,
  },

  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },

  hasError: {
    type: Boolean,
    required: false,
    default: false,
  },

  isEmpty: {
    type: Boolean,
    required: false,
    default: false,
  },

  codeMaxHeight: {
    type: String,
    required: false,
    default: null,
  },

  isSearchable: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const tabs = [
  {
    hash: '#universal',
    title: 'Universal',
  },
  {
    hash: '#kubernetes',
    title: 'Kubernetes',
  },
]

const activeTabHash = ref(tabs[0].hash)

const environment = store.getters['config/getEnvironment'] as string | undefined
if (typeof environment === 'string') {
  activeTabHash.value = '#' + environment
}

const yamlContent = computed(() => {
  const kubernetesObj: any = {}

  // assemble the main part of our object
  kubernetesObj.apiVersion = 'kuma.io/v1alpha1'
  kubernetesObj.kind = props.content.type

  if (props.content.mesh !== undefined) {
    // mesh is not defined on global scoped objects
    kubernetesObj.mesh = props.content.mesh
  }

  if (props.content.name?.includes('.')) {
    // if name from Kuma has '.' it means it's k8s name joined with a namespace by dot
    const parts = props.content.name.split('.')
    const namespace = parts.pop()
    // on multi-zone when dataplanes from zone are synced to global the format is 'name.<zone-ns>.<global-ns>' so the name is `name.<zone-ns>`
    const k8sName = parts.join('.')

    kubernetesObj.metadata = {
      name: k8sName,
      namespace,
    }
  } else {
    kubernetesObj.metadata = { name: props.content.name }
  }

  // if there are additional values, place them under `spec` accordingly
  // remove the `type`, `mesh` and `name` because we don't need them here
  const { type, name, mesh, ...spec } = props.content
  if (Object.keys(spec).length > 0) {
    kubernetesObj.spec = spec
  }

  const items = {
    universal: json2yaml(props.content),
    kubernetes: json2yaml(kubernetesObj),
  }

  return items
})
</script>
