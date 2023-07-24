<template>
  <RouteView
    v-slot="{ route }"
    name="policies-list-view"
  >
    <!--
      Load in all the potential policy types. This means we can find an valid 'selected' type
      and we also use this for the select menu further down
    -->
    <DataSource
      v-slot="{data: policies, error: policyError}: PolicyTypeCollectionSource"
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
          v-for="selected in [policies.policies.find(item => item.path === route.params.policyPath) ?? policies.policies[0]]"
          :key="selected.path"
        >
          <!--
            Load in all the policies for this type to render the listing
          -->
          <DataSource
            v-slot="{data, error}: PolicyCollectionSource"
            :src="`/${route.params.mesh}/policy-type/${selected.path}?page=${props.page}&size=${props.size}`"
          >
            <AppView>
              <template #title>
                <h2>
                  Policies: <RouteTitle
                    :title="t('policies.routes.items.title', {name: selected.name})"
                    :render="true"
                  />
                </h2>
              </template>
              <div
                class="relative"
                :class="selected.path"
              >
                <div class="stack">
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
                  <KCard>
                    <template #body>
                      <AppCollection
                        class="policy-collection"
                        data-testid="policy-collection"
                        :empty-state-title="`No Data`"
                        :empty-state-message="`There are no ${selected.name} policies present.`"
                        :headers="[
                          { label: 'Name', key: 'name' },
                          { label: 'Type', key: 'type' },
                          { label: 'Actions', key: 'actions', hideLabel: true },
                        ]"
                        :page-number="props.page"
                        :page-size="props.size"
                        :total="data?.total"
                        :items="data?.items"
                        :error="error"
                        @change="route.update"
                      >
                        <template #toolbar>
                          <!--
                              Load in all the totals for the policies so we can show them in the dropdown menu
                            -->
                          <DataSource
                            v-slot="{data: insights}: MeshInsightSource"
                            :src="`/${route.params.mesh}/insights`"
                          >
                            <KSelect
                              label="Policies"
                              :items="policies.policies.map(item => ({
                                label: item.name,
                                value: item.path,
                                selected: item.path === route.params.policyPath,
                              }))"
                              :label-attributes="{ class: 'visually-hidden' }"
                              appearance="select"
                              :enable-filtering="true"
                              @selected="(item: SelectItem) => route.replace({
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
                        <template #name="{ row: item }">
                          <RouterLink
                            :to="{
                              name: 'policy-detail-view',
                              params: {
                                policy: item.name,
                              },
                            }"
                          >
                            {{ item.name }}
                          </RouterLink>
                        </template>
                        <template #type="{ row: item }">
                          {{ item.type }}
                        </template>
                        <template #actions="{ row: item }">
                          <KDropdownMenu
                            class="actions-dropdown"
                            :kpop-attributes="{ placement: 'bottomEnd', popoverClasses: 'mt-5 more-actions-popover' }"
                            width="150"
                          >
                            <template #default>
                              <KButton
                                class="non-visual-button"
                                appearance="secondary"
                                size="small"
                              >
                                <template #icon>
                                  <KIcon
                                    color="var(--black-400)"
                                    icon="more"
                                    size="16"
                                  />
                                </template>
                              </KButton>
                            </template>

                            <template #items>
                              <KDropdownItem
                                :item="{
                                  to: {
                                    name: 'policy-detail-view',
                                    params: {
                                      policy: item.name,
                                    },
                                  },
                                  label: t('common.collection.actions.view'),
                                }"
                              />
                            </template>
                          </KDropdownMenu>
                        </template>
                      </AppCollection>
                    </template>
                  </KCard>
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
  KDropdownMenu, KDropdownItem, KButton, KIcon,
} from '@kong/kongponents'

import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import DocumentationLink from '@/app/common/DocumentationLink.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { MeshInsightSource } from '@/app/meshes/sources'
import type {
  PolicyCollectionSource,
  PolicyTypeCollectionSource,
} from '@/app/policies/sources'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  page: number
  size: number
}>()
</script>

<style lang="scss" scoped>
.policy-type-empty {
  color: var(--grey-400);
}

.actions-dropdown {
  display: inline-block;
}
</style>

<style lang="scss">
.policy-collection {
  .actions-column {
    width: 5%;
    min-width: 80px;
    text-align: end;
  }
}
</style>
