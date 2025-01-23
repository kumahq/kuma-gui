<template>
  <RouteView
    name="policy-list-view"
    :params="{
      page: 1,
      size: 50,
      mesh: '',
      policyPath: '',
      policy: '',
      s: '',
    }"
    v-slot="{ route, t, can, uri, me }"
  >
    <DataCollection
      :predicate="(policyType) => typeof policyType !== 'undefined' && policyType.path === route.params.policyPath"
      :items="props.policyTypes ?? []"
    >
      <template #empty>
        <XEmptyState>
          {{ t('policies.routes.items.empty') }}
        </XEmptyState>
      </template>
      <template #item="{ item: type }">
        <AppView>
          <div class="stack">
            <XCard>
              <header>
                <div>
                  <XBadge
                    v-if="type.isExperimental"
                    appearance="warning"
                  >
                    {{ t('policies.collection.beta') }}
                  </XBadge>

                  <XBadge
                    v-if="type.isInbound"
                    appearance="neutral"
                  >
                    {{ t('policies.collection.inbound') }}
                  </XBadge>

                  <XBadge
                    v-if="type.isOutbound"
                    appearance="neutral"
                  >
                    {{ t('policies.collection.outbound') }}
                  </XBadge>

                  <XAction
                    action="docs"
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
              <XI18n
                :path="`policies.type.${type.name}.description`"
                default-message="t('policies.collection.description')"
              />
            </XCard>

            <XCard>
              <search>
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
                  <DataCollection
                    :items="data?.items ?? [undefined]"
                    :page="route.params.page"
                    :page-size="route.params.size"
                    :total="data?.total"
                    @change="route.update"
                  >
                    <template
                      #empty
                    >
                      <XEmptyState>
                        <template #title>
                          <h3>
                            {{ t('policies.x-empty-state.title') }}
                          </h3>
                        </template>
                        <XI18n
                          path="policies.x-empty-state.body"
                          :params="{
                            type: type.name,
                            suffix: route.params.s.length > 0 ? t('common.matchingsearch') : '',
                          }"
                        />
                        <template
                          #action
                        >
                          <XAction
                            action="docs"
                            :href="t('policies.href.docs', { name: type.name })"
                          >
                            {{ t('common.documentation') }}
                          </XAction>
                        </template>
                      </XEmptyState>
                    </template>
                    <template
                      #default
                    >
                      <AppCollection
                        :headers="[
                          { ...me.get('headers.role'), label: 'Role', key: 'role', hideLabel: true },
                          { ...me.get('headers.name'), label: 'Name', key: 'name' },
                          { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                          ...(can('use zones') && type.isTargetRefBased ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                          ...(type.isTargetRefBased ? [{ ...me.get('headers.targetRef'), label: 'Target ref', key: 'targetRef' }] : []),
                          { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                        ]"
                        :items="data?.items"
                        :is-selected-row="(row) => row.id === route.params.policy"
                        @resize="me.set"
                      >
                        <template
                          #role="{ row: item }"
                        >
                          <template
                            v-if="item.role === 'producer'"
                          >
                            <XIcon
                              :name="`policy-role-${item.role}`"
                            >
                              Role: {{ item.role }}
                            </XIcon>
                          </template>
                          <template
                            v-else
                          >
                            &nbsp;
                          </template>
                        </template>

                        <template #name="{ row }">
                          <XAction
                            data-action
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
                          <XBadge
                            v-if="typeof row.spec?.targetRef !== 'undefined'"
                            appearance="neutral"
                          >
                            {{ row.spec.targetRef.kind }}<span v-if="row.spec.targetRef.name">:<b>{{ row.spec.targetRef.name }}</b></span>
                          </XBadge>
                          <XBadge
                            v-else
                            appearance="neutral"
                          >
                            Mesh
                          </XBadge>
                        </template>

                        <template #zone="{ row }">
                          <template v-if="row.zone">
                            <XAction
                              :to="{
                                name: 'zone-cp-detail-view',
                                params: {
                                  zone: row.zone,
                                },
                              }"
                            >
                              {{ row.zone }}
                            </XAction>
                          </template>

                          <template v-else>
                            {{ t('common.detail.none') }}
                          </template>
                        </template>

                        <template #actions="{ row: item }">
                          <XActionGroup>
                            <XAction
                              :to="{
                                name: 'policy-detail-view',
                                params: {
                                  mesh: item.mesh,
                                  policyPath: type.path,
                                  policy: item.id,
                                },
                              }"
                            >
                              {{ t('common.collection.actions.view') }}
                            </XAction>
                          </XActionGroup>
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
            </XCard>
          </div>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { PolicyType } from '../data'
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import SummaryView from '@/app/common/SummaryView.vue'
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
search form {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  flex-wrap: wrap;
  gap: $kui-space-70;
  margin-bottom: $kui-space-70;
}
.app-collection:deep(:is(th, td):nth-child(1)) {
  padding-right: 0 !important;
  width: 16px !important;
}
.app-collection :deep(td:nth-child(2) a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}
</style>
