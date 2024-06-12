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
    <DataSource
      v-slot="{ data, error }: PolicySource"
      :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}`"
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
        <template
          v-if="data"
          #title
        >
          <h1>
            <TextWithCopyButton
              :text="data.name"
            >
              <RouteTitle
                :title="t('policies.routes.item.title', { name: data.name })"
              />
            </TextWithCopyButton>
          </h1>
        </template>
        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
          <div
            v-if="data"
            class="stack"
            data-testid="detail-view-details"
          >
            <KCard>
              <h2>
                {{ t('policies.detail.affected_dpps') }}
              </h2>

              <DataLoader
                v-slot="{ data: dataplanesData }: PolicyDataplaneCollectionSource"
                :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}/dataplanes`"
              >
                <div class="mt-4">
                  <DataCollection
                    v-slot="{ items }"
                    :items="dataplanesData!.items"
                  >
                    <KInput
                      :model-value="route.params.dataplane"
                      type="search"
                      :placeholder="t('policies.detail.dataplane_input_placeholder')"
                      data-testid="dataplane-search-input"
                      @input="route.update({ dataplane: $event })"
                    />

                    <DataCollection
                      :items="items"
                      :predicate="item => item.name.toLowerCase().includes(route.params.dataplane.toLowerCase())"
                      :empty="false"
                    >
                      <template
                        #default="{ items: dataplanes }"
                      >
                        <ul
                          data-testid="affected-data-plane-proxies"
                        >
                          <li
                            v-for="item in dataplanes"
                            :key="item.name"
                            data-testid="dataplane-name"
                          >
                            <RouterLink
                              :to="{
                                name: 'data-plane-detail-view',
                                params: {
                                  mesh: item.mesh,
                                  dataPlane: item.id,
                                },
                              }"
                            >
                              {{ item.name }}
                            </RouterLink>
                          </li>
                        </ul>
                      </template>
                    </DataCollection>
                  </DataCollection>
                </div>
              </DataLoader>
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
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import type { PolicyDataplaneCollectionSource, PolicySource } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
