<template>
  <RouteView
    :name="props.routeName"
    :params="{
      subscription: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
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
                  :selected="route.params.format"
                  @change="(value) => {
                    route.update({ format: value })
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

            <template v-if="route.params.format === 'structured'">
              <XLayout
                type="stack"
                data-testid="structured-view"
              >
                <div
                  class="stack-with-borders"
                >
                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('http.api.property.version') }}
                    </template>

                    <template #body>
                      <template
                        v-for="version in [item.version?.kumaCp?.version]"
                      >
                        {{ version ?? '-' }}
                      </template>
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('http.api.property.connectTime') }}
                    </template>

                    <template #body>
                      {{ t('common.formats.datetime', { value: Date.parse(item.connectTime ?? '') }) }}
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="item.disconnectTime"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('http.api.property.disconnectTime') }}
                    </template>

                    <template #body>
                      {{ t('common.formats.datetime', { value: Date.parse(item.disconnectTime) }) }}
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('subscriptions.routes.item.headers.responses') }}
                    </template>

                    <template #body>
                      <template
                        v-for="responses in [item.status?.total ?? {}]"
                      >
                        {{ responses.responsesSent }}/{{ responses.responsesAcknowledged }}
                      </template>
                    </template>
                  </DefinitionCard>
                  <template
                    v-for="prop in (['zoneInstanceId', 'globalInstanceId', 'controlPlaneInstanceId'] as const)"
                    :key="typeof prop"
                  >
                    <DefinitionCard
                      v-if="item[prop]"
                      layout="horizontal"
                    >
                      <template #title>
                        {{ t(`http.api.property.${prop}`) }}
                      </template>

                      <template #body>
                        {{ item[prop] }}
                      </template>
                    </DefinitionCard>
                  </template>
                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('http.api.property.id') }}
                    </template>

                    <template #body>
                      {{ item.id }}
                    </template>
                  </DefinitionCard>
                </div>
                <XAlert
                  v-if="Object.keys(item.status.acknowledgements).length === 0"
                  variant="info"
                >
                  <template #icon>
                    <PortalIcon />
                  </template>

                  {{ t('common.detail.subscriptions.no_stats', { id: item.id }) }}
                </XAlert>
                <div
                  v-else
                  class="mt-8 stack-with-borders"
                >
                  <div>
                    <slot name="default" />
                  </div>
                  <DefinitionCard
                    class="mt-4"
                    layout="horizontal"
                  >
                    <template #title>
                      <strong>
                        {{ t('subscriptions.routes.item.headers.type') }}
                      </strong>
                    </template>

                    <template #body>
                      {{ t('subscriptions.routes.item.headers.stat') }}
                    </template>
                  </DefinitionCard>
                  <template
                    v-for="[key, _item] in Object.entries(item.status.acknowledgements ?? {})"
                    :key="key"
                  >
                    <DefinitionCard
                      layout="horizontal"
                    >
                      <template #title>
                        {{ t(`http.api.property.${key}`) }}
                      </template>

                      <template #body>
                        {{ _item.responsesSent }}/{{ _item.responsesAcknowledged }}
                      </template>
                    </DefinitionCard>
                  </template>
                </div>
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
import { PortalIcon } from '@kong/icons'

import type { Subscription } from '../data/'
import { YAML } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

const props = defineProps<{
  data: Subscription[]
  routeName: string
}>()
</script>
