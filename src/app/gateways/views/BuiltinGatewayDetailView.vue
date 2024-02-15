<template>
  <RouteView
    v-slot="{ route, t }"
    name="builtin-gateway-detail-view"
    :params="{
      mesh: '',
      gateway: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      dataplane: '',
    }"
  >
    <AppView>
      <DataSource
        v-slot="{ data, error }: MeshGatewaySource"
        :src="`/meshes/${route.params.mesh}/mesh-gateways/${route.params.gateway}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <div
          v-else
          class="stack"
        >
          <KCard>
            <h2>{{ t('builtin-gateways.detail.affected_dpps') }}</h2>

            <div class="mt-4">
              <KInput
                :model-value="route.params.dataplane"
                type="text"
                :placeholder="t('builtin-gateways.detail.dataplane_input_placeholder')"
                required
                data-testid="dataplane-search-input"
                @input="route.update({ dataplane: $event })"
              />

              <DataSource
                v-slot="{ data: dataplanesData, error: dataplanesError }: PolicyDataplaneCollectionSource"
                :src="`/meshes/${route.params.mesh}/mesh-gateways/${route.params.gateway}/dataplanes`"
              >
                <ErrorBlock
                  v-if="dataplanesError"
                  :error="dataplanesError"
                />

                <LoadingBlock v-else-if="dataplanesData === undefined" />

                <EmptyBlock v-else-if="dataplanesData.items.length === 0" />

                <template v-else>
                  <ul data-testid="affected-data-plane-proxies">
                    <li
                      v-for="(policyDataplane, key) in dataplanesData.items.filter((policyDataplane) => policyDataplane.name.toLowerCase().includes(route.params.dataplane.toLowerCase()))"
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
          </KCard>

          <ResourceCodeBlock
            v-slot="{ copy, copying }"
            :resource="data.config"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <DataSource
              v-if="copying"
              :src="`/meshes/${data.mesh}/mesh-gateways/${data.name}/as/kubernetes?no-store`"
              @change="(data) => {
                copy((resolve) => resolve(data))
              }"
              @error="(error) => {
                copy((_resolve, reject) => reject(error))
              }"
            />
          </ResourceCodeBlock>
        </div>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshGatewaySource } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { PolicyDataplaneCollectionSource } from '@/app/policies/sources'
</script>
