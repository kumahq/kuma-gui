<template>
  <div class="policy-details">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <EmptyBlock v-else-if="policy === null" />

    <TabsWidget
      v-if="policy !== null"
      :tabs="tabs"
    >
      <template #tabHeader>
        <h1
          class="entity-heading"
          data-testid="policy-single-entity"
        >
          {{ policy.name }}
        </h1>
      </template>
      <template #overview>
        <LabelList>
          <div data-testid="policy-overview-tab">
            <ul>
              <template
                v-for="(val, key) in policy"
                :key="key"
              >
                <li
                  v-if="['type', 'mesh', 'name'].includes(key)"
                >
                  <h4>{{ key }}</h4>
                  <p>
                    {{ val }}
                  </p>
                </li>
              </template>
            </ul>
          </div>
        </LabelList>
        <div class="config-wrapper">
          <YamlView
            id="code-block-policy"
            :content="stripTimes(policy)"
            is-searchable
          />
        </div>
      </template>

      <template #affected-dpps>
        <PolicyConnections
          :mesh="policy.mesh"
          :policy-name="policy.name"
          :policy-type="props.policyPath"
        />
      </template>
    </TabsWidget>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import PolicyConnections from '../components/PolicyConnections.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LabelList from '@/app/common/LabelList.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import YamlView from '@/app/common/YamlView.vue'
import type {
  PolicyEntity,
} from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { stripTimes } from '@/utilities/helpers'

const kumaApi = useKumaApi()

const props = defineProps<{
  mesh: string,
  policyPath: string,
  policyName: string,
}>()
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

const policy = ref<PolicyEntity | null>(null)
const isLoading = ref<Boolean>(true)
const error = ref<Error | null>(null)

async function loadData({ mesh, policyPath, policyName }: { mesh: string, policyPath: string, policyName: string }) {
  isLoading.value = true
  error.value = null
  policy.value = null

  try {
    policy.value = await kumaApi.getSinglePolicyEntity({
      mesh,
      path: policyPath,
      name: policyName,
    })
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}
loadData(props)
</script>
