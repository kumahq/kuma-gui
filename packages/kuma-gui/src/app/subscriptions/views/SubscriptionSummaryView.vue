<template>
  <RouteView
    :name="props.routeName"
    :params="{
      subscription: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      output: String,
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.data"
      :predicate="item => item.id === route.params.subscription"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template #title>
            <h2>
              {{ item.zoneInstanceId ?? item.globalInstanceId ?? item.controlPlaneInstanceId }}
            </h2>
          </template>

          <XLayout
            type="stack"
          >
            <header>
              <XLayout
                type="separated"
                justify="end"
              >
                <XSelect
                  :label="t('subscriptions.routes.item.format')"
                  :selected="route.params.output"
                  @change="(value) => {
                    route.update({ output: value })
                  }"
                >
                  <template
                    v-for="value in ['structured', 'yaml']"
                    :key="value"
                    #[`${value}-option`]
                  >
                    {{ t(`subscriptions.routes.item.formats.${value}`) }}
                  </template>
                </XSelect>
              </XLayout>
            </header>

            <template v-if="route.params.output === 'structured'">
              <XLayout
                type="stack"
                data-testid="structured-view"
              >
                <XTable
                  variant="kv"
                >
                  <tbody>
                    <tr
                      v-for="[key, value] in [
                        [t('http.api.property.version'), item.version?.kumaCp?.version ?? '-'],
                        [t('http.api.property.connectTime'), t('common.formats.datetime', { value: Date.parse(item.connectTime ?? '') })],
                        ...(item.disconnectTime ? [[t('http.api.property.disconnectTime'), t('common.formats.datetime', { value: Date.parse(item.disconnectTime) })]] : []),
                        [t('subscriptions.routes.item.headers.responses'), `${item.status.total.responsesSent}/${item.status.total.responsesAcknowledged}`],
                      ].concat(
                        (['zoneInstanceId', 'globalInstanceId', 'controlPlaneInstanceId'] as const).reduce((prev, prop) => {
                          if(item[prop]) {
                            prev.push([t(`http.api.property.${prop}`), item[prop]])
                          }
                          return prev
                        }, ([] as [string, string][])),
                      ).concat([
                        [t('http.api.property.id'), item.id],
                      ])"
                      :key="key"
                    >
                      <th
                        scope="row"
                      >
                        {{ key }}
                      </th>
                      <td>
                        {{ value }}
                      </td>
                    </tr>
                  </tbody>
                </XTable>

                <DataCollection
                  :items="Object.entries(item.status.acknowledgements ?? {})"
                >
                  <template
                    #empty
                  >
                    <XAlert
                      variant="info"
                    >
                      {{ t('common.detail.subscriptions.no_stats', { id: item.id }) }}
                    </XAlert>
                  </template>
                  <template
                    #default="{ items }"
                  >
                    <XLayout
                      type="stack"
                    >
                      <slot name="default" />
                      <template
                        v-for="rejected in [items.filter(([key, item]) => item.responsesRejected > 0)]"
                        :key="typeof rejected"
                      >
                        <template
                          v-if="rejected.length > 0"
                        >
                          <XAlert
                            :variant="!item.disconnectTime ? 'warning' : 'info'"
                          >
                            <XI18n
                              path="subscriptions.notifications.with-nacks"
                            />
                          </XAlert>

                          <XTable
                            variant="kv"
                          >
                            <thead>
                              <tr>
                                <th>
                                  {{ t('subscriptions.routes.item.headers.type') }}
                                </th>
                                <th>
                                  {{ t('subscriptions.routes.item.headers.stat') }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="[key, value] in rejected"
                                :key="key"
                              >
                                <th
                                  scope="row"
                                >
                                  {{ t(`http.api.property.${key}`) }}
                                </th>
                                <td>
                                  {{ value.responsesRejected }}
                                </td>
                              </tr>
                            </tbody>
                          </XTable>

                          <XTable
                            variant="kv"
                          >
                            <thead>
                              <tr>
                                <th>
                                  {{ t('subscriptions.routes.item.headers.type') }}
                                </th>
                                <th>
                                  {{ t('subscriptions.routes.item.headers.stat') }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="[key, value] in items"
                                :key="key"
                              >
                                <th
                                  scope="row"
                                >
                                  {{ t(`http.api.property.${key}`) }}
                                </th>
                                <td>
                                  {{ value.responsesSent }}/{{ value.responsesAcknowledged }}
                                </td>
                              </tr>
                            </tbody>
                          </XTable>
                        </template>
                      </template>
                    </XLayout>
                  </template>
                </DataCollection>
              </XLayout>
            </template>

            <template v-else>
              <XCodeBlock
                language="yaml"
                :code="YAML.stringify(item.$raw)"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </template>
          </XLayout>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Subscription } from '../data/'
import { YAML } from '@/app/application'

const props = defineProps<{
  data: Subscription[]
  routeName: string
}>()
</script>
