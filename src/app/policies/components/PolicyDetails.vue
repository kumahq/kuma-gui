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
        <YamlView
          id="code-block-policy"
          class="mt-4"
          :content="rawEntity"
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
import TabsWidget from '@/app/common/TabsWidget.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import YamlView from '@/app/common/YamlView.vue'

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

  rawEntity: {
    type: Object,
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
</script>
