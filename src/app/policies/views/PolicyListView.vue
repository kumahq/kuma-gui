<template>
  <RouteView
    v-slot="{ route }"
    name="policies-list-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('policies.routes.items.title')"
            :render="true"
          />
        </h2>
      </template>

      <!--
        Load in all the potential policy types.
        This means we can find an valid 'selected' type.
        It’s also used for the list of policy types.
      -->
      <DataSource
        v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
        :src="`/*/policy-types`"
      >
        <ErrorBlock
          v-if="policyTypesError"
          :error="policyTypesError"
        />

        <LoadingBlock v-else-if="policyTypesData === undefined" />

        <EmptyBlock v-else-if="policyTypesData.policies.length === 0" />

        <template v-else>
          <DataSource
            v-slot="{ data, error }: PolicyCollectionSource"
            :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}?page=${props.page}&size=${props.size}`"
          >
            <DataSource
              v-slot="{ data: meshInsight }: MeshInsightSource"
              :src="`/mesh-insights/${route.params.mesh}`"
            >
              <PolicyList
                :page-number="props.page"
                :page-size="props.size"
                :current-policy-type-path="route.params.policyPath"
                :policy-types="policyTypesData.policies"
                :mesh-insight="meshInsight"
                :policy-collection="data"
                :policy-error="error"
                @change="route.update"
              />
            </DataSource>
          </DataSource>
        </template>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import PolicyList from '../components/PolicyList.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { MeshInsightSource } from '@/app/meshes/sources'
import type { PolicyCollectionSource, PolicyTypeCollectionSource } from '@/app/policies/sources'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  page: number
  size: number
}>()
</script>
