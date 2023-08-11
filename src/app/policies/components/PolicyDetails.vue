<template>
  <TabsWidget :tabs="tabs">
    <template #overview>
      <KCard>
        <template #body>
          <ResourceCodeBlock
            id="code-block-policy"
            :resource="props.policy"
            :resource-fetcher="fetchPolicy"
            is-searchable
          />
        </template>
      </KCard>
    </template>

    <template #affected-dpps>
      <KCard>
        <template #body>
          <PolicyConnections
            :mesh="props.policy.mesh"
            :policy-name="props.policy.name"
            :policy-path="props.path"
          />
        </template>
      </KCard>
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { PropType } from 'vue'

import PolicyConnections from '../components/PolicyConnections.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import type { PolicyEntity } from '@/types/index.d'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()

const props = defineProps({
  policy: {
    type: Object as PropType<PolicyEntity>,
    required: true,
  },

  path: {
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

async function fetchPolicy(params?: SingleResourceParameters) {
  const { name, mesh } = props.policy
  const path = props.path

  return await kumaApi.getSinglePolicyEntity({ name, mesh, path }, params)
}
</script>
