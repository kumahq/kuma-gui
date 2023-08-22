<template>
  <div class="stack">
    <KCard>
      <template #body>
        <h2>{{ t('policies.detail.affected_dpps') }}</h2>

        <PolicyConnections
          :mesh="props.policy.mesh"
          :policy-name="props.policy.name"
          :policy-path="props.path"
        />
      </template>
    </KCard>

    <ResourceCodeBlock
      id="code-block-policy"
      :resource="props.policy"
      :resource-fetcher="fetchPolicy"
      is-searchable
    />
  </div>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { PropType } from 'vue'

import PolicyConnections from '../components/PolicyConnections.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import type { PolicyEntity } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'

const { t } = useI18n()
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

async function fetchPolicy(params?: SingleResourceParameters) {
  const { name, mesh } = props.policy
  const path = props.path

  return await kumaApi.getSinglePolicyEntity({ name, mesh, path }, params)
}
</script>
