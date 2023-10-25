<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="policy-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        policyPath: '',
      }"
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
              :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}?page=${route.params.page}&size=${route.params.size}`"
            >
              <DataSource
                v-slot="{ data: meshInsight }: MeshInsightSource"
                :src="`/mesh-insights/${route.params.mesh}`"
              >
                <PolicyList
                  :key="route.params.policyPath"
                  :page-number="parseInt(route.params.page)"
                  :page-size="parseInt(route.params.size)"
                  :current-policy-type="policyTypesData.policies.find((policyType) => policyType.path === route.params.policyPath) ?? policyTypesData.policies[0]"
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
  </DataSource>
</template>

<script lang="ts" setup>
import PolicyList from '../components/PolicyList.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { MeSource } from '@/app/me/sources'
import type { MeshInsightSource } from '@/app/meshes/sources'
import type { PolicyCollectionSource, PolicyTypeCollectionSource } from '@/app/policies/sources'
</script>
