<template>
  <div>
    <KInput
      id="dataplane-search"
      v-model="searchInput"
      type="text"
      :placeholder="t('policies.detail.dataplane_input_placeholder')"
      required
      data-testid="dataplane-search-input"
    />

    <DataSource
      v-slot="{ data, error }: PolicyDataplaneCollectionSource"
      :src="`/meshes/${props.mesh}/policy-path/${props.policyPath}/policy/${props.policyName}/dataplanes`"
    >
      <ErrorBlock
        v-if="error"
        :error="error"
      />

      <LoadingBlock v-else-if="data === undefined" />

      <EmptyBlock v-else-if="data.items.length === 0" />

      <template v-else>
        <ul data-testid="affected-data-plane-proxies">
          <li
            v-for="(policyDataplane, key) in data.items.filter((policyDataplane) => policyDataplane.name.toLowerCase().includes(searchInput.toLowerCase()))"
            :key="key"
            data-testid="dataplane-name"
          >
            <RouterLink
              :to="{
                name: 'data-plane-detail-view',
                params: {
                  mesh: policyDataplane.mesh,
                  dataPlane: policyDataplane.name,
                },
              }"
            >
              {{ policyDataplane.name }}
            </RouterLink>
          </li>
        </ul>
      </template>
    </DataSource>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { PolicyDataplaneCollectionSource } from '../sources'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  mesh: string
  policyPath: string
  policyName: string
}>()

const searchInput = ref('')
</script>
