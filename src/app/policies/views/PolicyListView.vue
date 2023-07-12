<template>
  <RouteView
    v-slot="{ route: _route}"
  >
    <DataSource
      v-slot="{data: policies, error: policyError, refresh: policyRefresh}: PolicyTypeCollectionSource"
      :src="`/*/policy-types`"
    >
      <ErrorBlock
        v-if="policyError"
        :error="policyError"
      />
      <LoadingBlock v-else-if="policies === undefined" />
      <EmptyBlock v-else-if="policies.policies.length === 0" />

      <template
        v-else
      >
        <template
          v-for="selected in [policies.policies.find(item => item.path === _route.params.policyPath) ?? policies.policies[0]]"
          :key="selected.path"
        >
          <DataSource
            v-slot="{data, error, refresh}: PolicyCollectionSource"
            :src="`/${_route.params.mesh}/policy-type/${selected.path}?offset=${route.query.offset || '0'}`"
            @change="change"
          >
            <RouteTitle
              :title="t('policies.routes.items.title', {name: selected.name})"
            />
            <AppView>
              <div
                class="relative"
                :class="selected.path"
              >
                <div class="kcard-stack">
                  <div class="kcard-border">
                    <KCard
                      v-if="selected.isExperimental"
                      border-variant="noBorder"
                      class="mb-4"
                    >
                      <template #body>
                        <KAlert appearance="warning">
                          <template #alertMessage>
                            <p>
                              <strong>Warning</strong> This policy is experimental. If you encountered any problem please open an
                              <a
                                href="https://github.com/kumahq/kuma/issues/new/choose"
                                target="_blank"
                                rel="noopener noreferrer"
                              >issue</a>
                            </p>
                          </template>
                        </KAlert>
                      </template>
                    </KCard>

                    <DataOverview
                      :selected-entity-name="route.query.policy as string ?? undefined"
                      :page-size="PAGE_SIZE_DEFAULT"
                      :error="error"
                      :is-loading="typeof data === 'undefined' && typeof error === 'undefined'"
                      :empty-state="{
                        title: 'No Data',
                        message: `There are no ${selected.name} policies present.`,
                      }"
                      :table-data="{
                        headers: [
                          { label: 'Name', key: 'entity' },
                          { label: 'Type', key: 'type' },
                        ],
                        data: (data?.items || []).map(item => ({
                          entity: item,
                          type: item.type,
                          detailViewRoute: {
                            name: 'policy-detail-view',
                            params: {
                              mesh: item.mesh,
                              policyPath: _route.params.policyPath,
                              policy: item.name
                            }
                          }
                        }))
                      }"
                      :table-data-is-empty="data && data.items.length === 0"
                      :next="data?.next"
                      :page-offset="route.query.offset ? parseInt(route.query.offset as string) : 0"
                      @table-action="item => {
                        router.push(
                          {
                            name: 'policies-list-view',
                            query: {
                              policy: item.name
                            }
                          }
                        )
                      }"
                      @refresh="() => {refresh(); policyRefresh()}"
                      @load-data="offset => {
                        router.push(
                          {
                            name: 'policies-list-view',
                            query: {
                              policy: route.query.policy,
                              offset: offset
                            }
                          }
                        )
                      }"
                    >
                      <template #additionalControls>
                        <DataSource
                          v-slot="{data: insights}: MeshInsightSource"
                          :src="`/${_route.params.mesh}/insights`"
                        >
                          <KSelect
                            label="Policies"
                            :items="policies.policies.map(item => ({
                              label: item.name,
                              value: item.path,
                              selected: item.path === _route.params.policyPath,
                            }))"
                            :label-attributes="{ class: 'visually-hidden' }"
                            appearance="select"
                            :enable-filtering="true"
                            @selected="(item: SelectItem) => router.push({
                              name: 'policies-list-view',
                              params: {
                                ...route.params,
                                policyPath: item.value,
                              },
                            })"
                          >
                            <template #item-template="{ item }">
                              <span
                                :class="{
                                  'policy-type-empty': !insights?.policies[item.label]?.total
                                }"
                              >
                                {{ item.label }} ({{ insights?.policies[item.label]?.total || '0' }})
                              </span>
                            </template>
                          </KSelect>
                        </DataSource>

                        <DocumentationLink
                          :href="t('policies.href.docs', {'name': selected.name})"
                          data-testid="policy-documentation-link"
                        />
                      </template>
                    </DataOverview>
                  </div>
                  <PolicyDetails
                    v-if="route.query.policy"
                    :name="route.query.policy as string"
                    :mesh="_route.params.mesh"
                    :path="selected.path"
                    :type="selected.name"
                  />
                </div>
              </div>
            </AppView>
          </DataSource>
        </template>
      </template>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import {
  KAlert,
  KCard,
  KSelect,
  SelectItem,
} from '@kong/kongponents'
import { useRoute, useRouter } from 'vue-router'

import PolicyDetails from '../components/PolicyDetails.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import DocumentationLink from '@/app/common/DocumentationLink.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { MeshInsightSource } from '@/app/meshes/sources'
import type {
  PolicyCollection,
  PolicyCollectionSource,
  PolicyTypeCollectionSource,
} from '@/app/policies/sources'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useI18n } from '@/utilities'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const change = function (e: PolicyCollection) {
  e.items.length > 0 && !route.query.policy &&
    router.push(
      {
        name: 'policies-list-view',
        query: {
          policy: e.items[0].name,
        },
      },
    )
}

</script>

<style lang="scss" scoped>
.policy-type-empty {
  color: var(--grey-400);
}

.entity-heading {
  font-size: inherit;
  font-weight: var(--font-weight-regular);
}
</style>
