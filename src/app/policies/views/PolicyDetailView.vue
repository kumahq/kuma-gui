<template>
  <RouteView
    v-slot="{ route, t }"
    name="policy-detail-view"
    :params="{
      mesh: '',
      policy: '',
      policyPath: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      dataplane: '',
    }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh,
        },
        {
          to: {
            name: 'policy-list-view',
            params: {
              mesh: route.params.mesh,
              policyPath: route.params.policyPath,
            },
          },
          text: t('policies.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.policy">
            <RouteTitle
              :title="t('policies.routes.item.title', { name: route.params.policy })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: PolicySource"
        :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <div
          v-else
          class="stack"
          data-testid="detail-view-details"
        >
          <KCard>
            <h2>{{ t('policies.detail.affected_dpps') }}</h2>

            <div class="mt-4">
              <KInput
                :model-value="route.params.dataplane"
                type="text"
                :placeholder="t('policies.detail.dataplane_input_placeholder')"
                required
                data-testid="dataplane-search-input"
                @input="route.update({ dataplane: $event })"
              />

              <DataSource
                v-slot="{ data: dataplanesData, error: dataplanesError }: PolicyDataplaneCollectionSource"
                :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}/dataplanes`"
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
              :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}/as/kubernetes?no-store`"
              @change="(data) => {
                copy((resolve) => resolve(data))
              }"
              @error="(e) => {
                copy((_resolve, reject) => reject(e))
              }"
            />
          </ResourceCodeBlock>
        </div>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { PolicyDataplaneCollectionSource, PolicySource } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
