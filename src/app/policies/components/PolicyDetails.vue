<template>
  <div class="policy-details kcard-border">
    <TabsWidget :tabs="tabs">
      <template #tabHeader>
        <h1
          class="entity-heading"
          data-testid="policy-single-entity"
        >
          {{ props.type }}:

          <TextWithCopyButton :text="props.name">
            <router-link :to="detailViewRoute">
              {{ props.name }}
            </router-link>
          </TextWithCopyButton>
        </h1>
      </template>

      <template #overview>
        <ResourceCodeBlock
          id="code-block-policy"
          :resource-fetcher="fetchPolicy"
          :resource-fetcher-watch-key="props.name"
          is-searchable
        />
      </template>

      <template #affected-dpps>
        <PolicyConnections
          :mesh="props.mesh"
          :policy-name="props.name"
          :policy-path="props.path"
        />
      </template>
    </TabsWidget>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import PolicyConnections from '../components/PolicyConnections.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()

const props = defineProps({
  mesh: {
    type: String,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
})
const tabs = [
  {
    hash: '#overview',
    title: 'Overview',
  },
  {
    hash: '#affected-dpps',
    title: 'Affected DPPs',
  },
]

const detailViewRoute = computed(() => ({
  name: 'policy-detail-view',
  params: {
    mesh: props.mesh,
    policy: props.name,
    policyPath: props.path,
  },
}))

async function fetchPolicy(params?: SingleResourceParameters) {
  const { name, mesh, path } = props
  return await kumaApi.getSinglePolicyEntity({ name, mesh, path }, params)
}
</script>
