<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, can, uri }"
      name="policy-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        policyPath: '',
        policy: '',
        s: '',
      }"
    >
      <DataCollection
        :predicate="(policyType) => typeof policyType !== 'undefined' && policyType.path === route.params.policyPath"
        :items="props.policyTypes ?? []"
      >
        <template #empty>
          <EmptyBlock>
            <template #message>
              {{ t('policies.routes.items.empty') }}
            </template>
          </EmptyBlock>
        </template>
        <template #item="{ item: type }">
          <AppView>
            <div class="stack">
              <KCard>
                <header>
                  <div>
                    <KBadge
                      v-if="type.isExperimental"
                      appearance="warning"
                    >
                      {{ t('policies.collection.beta') }}
                    </KBadge>

                    <KBadge
                      v-if="type.isInbound"
                      appearance="neutral"
                    >
                      {{ t('policies.collection.inbound') }}
                    </KBadge>

                    <KBadge
                      v-if="type.isOutbound"
                      appearance="neutral"
                    >
                      {{ t('policies.collection.outbound') }}
                    </KBadge>

                    <XAction
                      type="docs"
                      :href="t('policies.href.docs', { name: type.name })"
                      data-testid="policy-documentation-link"
                    >
                      <span class="visually-hidden">{{ t('common.documentation') }}</span>
                    </XAction>
                  </div>
                  <h3>
                    <PolicyTypeTag
                      :policy-type="type.name"
                    >
                      {{ t('policies.collection.title', { name: type.name }) }}
                    </PolicyTypeTag>
                  </h3>
                </header>
                <div v-html="t(`policies.type.${type.name}.description`, undefined, { defaultMessage: t('policies.collection.description') })" />
              </KCard>

              <KCard>
                <DataLoader
                  :src="uri(sources, '/meshes/:mesh/policy-path/:path', {
                    mesh: route.params.mesh,
                    path: route.params.policyPath,
                  }, {
                    page: route.params.page,
                    size: route.params.size,
                    search: route.params.s,
                  })"
                >
                  <template
                    #loadable="{ data }"
                  >
                    <search
                      v-if="(data?.items ?? { length: 0 }).length > 0 || (route.params.s.length > 0)"
                    >
                      <form
                        @submit.prevent
                      >
                        <XInput
                          placeholder="Filter by name..."
                          type="search"
                          appearance="search"
                          :value="route.params.s"
                          :debounce="1000"
                          @change="(e) => route.update({
                            s: e,
                          })"
                        />
                      </form>
                    </search>
                    <DataCollection
                      :items="data?.items ?? [undefined]"
                    >
                      <template
                        #empty
                      >
                        <EmptyBlock>
                          <template #title>
                            {{ t('policies.x-empty-state.title') }}
                          </template>
                          <div
                            v-html="t('policies.x-empty-state.body', { type: type.name, suffix: route.params.s.length > 0 ? t('common.matchingsearch') : '' })"
                          />
                          <template
                            #action
                          >
                            <XAction
                              type="docs"
                              :href="t('policies.href.docs', { name: type.name })"
                            >
                              {{ t('common.documentation') }}
                            </XAction>
                          </template>
                        </EmptyBlock>
                      </template>
                      <template
                        #default
                      >
                        <AppCollection
                          :headers="[
                            { label: 'Name', key: 'name' },
                            { label: 'Namespace', key: 'namespace' },
                            ...(can('use zones') && type.isTargetRefBased ? [{ label: 'Zone', key: 'zone' }] : []),
                            ...(type.isTargetRefBased ? [{ label: 'Target ref', key: 'targetRef' }] : []),
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
                                  policyPath: type.path,
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
                            <template v-if="type.isTargetRefBased && typeof row.spec?.targetRef !== 'undefined'">
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
                                  policyPath: type.path,
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
                      </template>
                    </DataCollection>
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
                          :policy-type="type"
                        />
                      </SummaryView>
                    </RouterView>
                  </template>
                </DataLoader>
              </KCard>
            </div>
          </AppView>
        </template>
      </DataCollection>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import type { PolicyType } from '../data'
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { MeSource } from '@/app/me/sources'
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
  margin-top: 0;
  float: left;
}
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
