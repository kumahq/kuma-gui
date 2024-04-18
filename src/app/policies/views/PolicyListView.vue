<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, can }"
      name="policy-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        policyPath: '',
        policy: '',
      }"
    >
      <DataCollection
        :predicate="(policyType) => typeof policyType !== 'undefined' && policyType.path === route.params.policyPath"
        :find="true"
        :items="props.policyTypes ?? [undefined]"
      >
        <template #empty>
          <EmptyBlock>
            <template #message>
              {{ t('policies.routes.items.empty') }}
            </template>
          </EmptyBlock>
        </template>
        <template #default="{ items: types }">
          <template
            v-for="policyType in [types[0]!]"
            :key="policyType"
          >
            <AppView>
              <div class="stack">
                <KCard>
                  <header>
                    <div>
                      <KBadge
                        v-if="policyType.isExperimental"
                        appearance="warning"
                      >
                        {{ t('policies.collection.beta') }}
                      </KBadge>

                      <KBadge
                        v-if="policyType.isInbound"
                        appearance="neutral"
                      >
                        {{ t('policies.collection.inbound') }}
                      </KBadge>

                      <KBadge
                        v-if="policyType.isOutbound"
                        appearance="neutral"
                      >
                        {{ t('policies.collection.outbound') }}
                      </KBadge>

                      <XAction
                        type="docs"
                        :href="t('policies.href.docs', { name: policyType.name })"
                        data-testid="policy-documentation-link"
                      >
                        <span class="visually-hidden">{{ t('common.documentation') }}</span>
                      </XAction>
                    </div>
                    <h3>
                      <PolicyTypeTag
                        :policy-type="policyType.name"
                      >
                        {{ t('policies.collection.title', { name: policyType.name }) }}
                      </PolicyTypeTag>
                    </h3>
                  </header>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div v-html="t(`policies.type.${policyType.name}.description`, undefined, { defaultMessage: t('policies.collection.description') })" />
                </KCard>

                <KCard>
                  <DataLoader
                    v-slot="{ data }: PolicyCollectionSource"
                    :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}?page=${route.params.page}&size=${route.params.size}`"
                    :loader="false"
                  >
                    <AppCollection
                      class="policy-collection"
                      data-testid="policy-collection"
                      :empty-state-message="t('common.emptyState.message', { type: `${policyType.name} policies` })"
                      :empty-state-cta-to="t('policies.href.docs', { name: policyType.name })"
                      :empty-state-cta-text="t('common.documentation')"
                      :headers="[
                        { label: 'Name', key: 'name' },
                        { label: 'Namespace', key: 'namespace' },
                        ...(can('use zones') && policyType.isTargetRefBased ? [{ label: 'Zone', key: 'zone' }] : []),
                        ...(policyType.isTargetRefBased ? [{ label: 'Target ref', key: 'targetRef' }] : []),
                        { label: 'Details', key: 'details', hideLabel: true },
                      ]"
                      :page-number="route.params.page"
                      :page-size="route.params.size"
                      :total="data?.total"
                      :items="data?.items"
                      :is-selected-row="(row) => row.id === route.params.policy"
                      @change="route.update"
                    >
                      <template #name="{ row }">
                        <XAction
                          :to="{
                            name: 'policy-summary-view',
                            params: {
                              mesh: row.mesh,
                              policyPath: policyType.path,
                              policy: row.id,
                            },
                            query: {
                              page: route.params.page,
                              size: route.params.size,
                            },
                          }"
                        >
                          {{ row.name }}
                        </XAction>
                      </template>
                      <template #namespace="{ row: item }">
                        {{ item.namespace.length > 0 ? item.namespace : t('common.detail.none') }}
                      </template>

                      <template #targetRef="{ row }">
                        <template v-if="policyType.isTargetRefBased && typeof row.spec?.targetRef !== 'undefined'">
                          <KBadge appearance="neutral">
                            {{ row.spec.targetRef.kind }}<span v-if="row.spec.targetRef.name">:<b>{{ row.spec.targetRef.name }}</b></span>
                          </KBadge>
                        </template>

                        <template v-else>
                          {{ t('common.detail.none') }}
                        </template>
                      </template>

                      <template #zone="{ row }">
                        <template v-if="row.labels && row.labels['kuma.io/origin'] === 'zone' && row.labels['kuma.io/zone']">
                          <RouterLink
                            :to="{
                              name: 'zone-cp-detail-view',
                              params: {
                                zone: row.labels['kuma.io/zone'],
                              },
                            }"
                          >
                            {{ row.labels['kuma.io/zone'] }}
                          </RouterLink>
                        </template>

                        <template v-else>
                          {{ t('common.detail.none') }}
                        </template>
                      </template>

                      <template #details="{ row }">
                        <XAction
                          class="details-link"
                          data-testid="details-link"
                          :to="{
                            name: 'policy-detail-view',
                            params: {
                              mesh: row.mesh,
                              policyPath: policyType.path,
                              policy: row.id,
                            },
                          }"
                        >
                          {{ t('common.collection.details_link') }}

                          <ArrowRightIcon
                            decorative
                            :size="KUI_ICON_SIZE_30"
                          />
                        </XAction>
                      </template>
                    </AppCollection>
                    <RouterView
                      v-if="route.params.policy"
                      v-slot="{ Component }"
                    >
                      <SummaryView
                        @close="route.replace({
                          name: 'policy-list-view',
                          params: {
                            mesh: route.params.mesh,
                            policyPath: route.params.policyPath,
                          },
                          query: {
                            page: route.params.page,
                            size: route.params.size,
                          },
                        })"
                      >
                        <component
                          :is="Component"
                          v-if="typeof data !== 'undefined'"
                          :items="data.items"
                          :policy-type="policyType"
                        />
                      </SummaryView>
                    </RouterView>
                  </DataLoader>
                </KCard>
              </div>
            </AppView>
          </template>
        </template>
      </DataCollection>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import type { PolicyType } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { MeSource } from '@/app/me/sources'
import type { PolicyCollectionSource } from '@/app/policies/sources'
const props = defineProps<{
  policyTypes?: PolicyType[]
}>()
</script>
<style lang="scss" scoped>
header {
  display: flow-root;
}
header > * {
  margin-bottom: $kui-space-40;
}
header > div {
  float: right;
  display: flex;
  gap: $kui-space-40;
  align-items: flex-start;
}
header > h3 {
  /* TODO: remove :not(:first-child)s */
  margin-top: 0;
  float: left;
}
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
