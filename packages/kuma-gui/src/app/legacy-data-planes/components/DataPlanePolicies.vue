<template>
  <!-- if we are in non-federated zone mode try and load/show legacy policies -->
  <template v-if="!can('use zones')">
    <div>
      <DataLoader
        :src="uri(dataplaneSources, '/meshes/:mesh/dataplanes/:name/sidecar-dataplane-policies', {
          mesh: String(route.params.mesh),
          name: props.data.id,
        })"
        :data="[props.policyTypesDataResult]"
        v-slot="{ data: [sidecarDataplaneData] }"
      >
        <DataCollection
          :empty="false"
          :items="sidecarDataplaneData.policyTypeEntries"
          :predicate="(item) => policyTypes[item.type]?.policy.isTargetRef === false"
          v-slot="{ items }"
        >
          <h3>
            {{ t('data-planes.routes.item.legacy_policies') }}
          </h3>
          <XCard
            class="mt-4"
          >
            <PolicyTypeEntryList
              :items="items"
              :types="policyTypes"
              data-testid="sidecar-dataplane-policies"
            />
          </XCard>
        </DataCollection>
      </DataLoader>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useCan, useI18n, useUri } from '@/app/application'
import { sources as dataplaneSources } from '@/app/data-planes/sources'
import type { DataplaneOverview } from '@/app/data-planes/sources'
import PolicyTypeEntryList from '@/app/policies/components/PolicyTypeEntryList.vue'
import type { PolicyResourceType, PolicyResourceTypeCollection } from '@/app/policies/data'

const route = useRoute()
const can = useCan()
const uri = useUri()
const { t } = useI18n()

const props = defineProps<{
  data: DataplaneOverview
  policyTypes: Partial<Record<string, PolicyResourceType>>
  policyTypesDataResult: PolicyResourceTypeCollection | Error | undefined
}>()
</script>
