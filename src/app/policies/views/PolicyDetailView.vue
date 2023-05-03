<template>
  <div class="policy-details kcard-border">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <EmptyBlock v-else-if="policy === null" />

    <TabsWidget
      v-else
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
        <DefinitionList>
          <DefinitionListItem
            v-for="(value, property) in policy"
            :key="property"
            :term="property"
          >
            {{ value }}
          </DefinitionListItem>
        </DefinitionList>

        <YamlView
          v-if="policyConfig !== null"
          id="code-block-policy"
          class="mt-4"
          :content="policyConfig"
          is-searchable
        />
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import PolicyConnections from '../components/PolicyConnections.vue'
import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import YamlView from '@/app/common/YamlView.vue'
import { useStore } from '@/store/store'
import type {
  PolicyEntity,
} from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { stripTimes } from '@/utilities/helpers'

const kumaApi = useKumaApi()
const route = useRoute()
const store = useStore()

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

const rawPolicy = ref<PolicyEntity | null>(null)
const isLoading = ref<Boolean>(true)
const error = ref<Error | null>(null)

const policy = computed(() => {
  if (rawPolicy.value === null) {
    return null
  }

  const { type, name, mesh } = rawPolicy.value

  return { type, name, mesh }
})
const policyConfig = computed(() => rawPolicy.value !== null ? stripTimes(rawPolicy.value) : null)

start()

function start() {
  store.dispatch('updatePageTitle', route.params.policy)

  loadData(props)
}

async function loadData({ mesh, policyPath, policyName }: { mesh: string, policyPath: string, policyName: string }) {
  isLoading.value = true
  error.value = null
  rawPolicy.value = null

  try {
    rawPolicy.value = await kumaApi.getSinglePolicyEntity({
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
</script>
