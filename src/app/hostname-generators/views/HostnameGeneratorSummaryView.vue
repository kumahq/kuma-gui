<template>
  <RouteView
    name="hostname-generator-summary-view"
    :params="{
      name: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, can }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.name"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template #title>
            <h2>
              <XAction
                :to="{
                  name: 'hostname-generator-detail-view',
                  params: {
                    name: route.params.name,
                  },

                }"
              >
                <RouteTitle
                  :title="t('hostname-generators.routes.item.title', { name: item.name })"
                />
              </XAction>
            </h2>
          </template>

          <div
            class="stack"
          >
            <div
              class="stack-with-borders"
            >
              <DefinitionCard
                v-if="item.namespace.length > 0"
                layout="horizontal"
              >
                <template
                  #title
                >
                  {{ t('hostname-generators.common.namespace') }}
                </template>

                <template
                  #body
                >
                  {{ item.namespace }}
                </template>
              </DefinitionCard>
              <DefinitionCard
                v-if="can('use zones') && item.zone"
                layout="horizontal"
              >
                <template
                  #title
                >
                  {{ t('hostname-generators.common.zone') }}
                </template>
                <template
                  #body
                >
                  <XAction
                    :to="{
                      name: 'zone-cp-detail-view',
                      params: {
                        zone: item.zone,
                      },
                    }"
                  >
                    {{ item.zone }}
                  </XAction>
                </template>
              </DefinitionCard>
              <DefinitionCard
                v-if="item.spec.template"
                layout="horizontal"
              >
                <template
                  #title
                >
                  {{ t('hostname-generators.common.template') }}
                </template>
                <template
                  #body
                >
                  {{ item.spec.template }}
                </template>
              </DefinitionCard>
            </div>
            <div>
              <h3>
                {{ t('hostname-generators.routes.item.config') }}
              </h3>

              <div class="mt-4">
                <ResourceCodeBlock
                  :resource="item.$raw"
                  is-searchable
                  :query="route.params.codeSearch"
                  :is-filter-mode="route.params.codeFilter"
                  :is-reg-exp-mode="route.params.codeRegExp"
                  @query-change="route.update({ codeSearch: $event })"
                  @filter-mode-change="route.update({ codeFilter: $event })"
                  @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                  v-slot="{ copy, copying }"
                >
                  <DataSource
                    v-if="copying"
                    :src="`/hostnamegenerators/${route.params.name}/as/kubernetes?no-store`"
                    @change="(data) => {
                      copy((resolve) => resolve(data))
                    }"
                    @error="(e) => {
                      copy((_resolve, reject) => reject(e))
                    }"
                  />
                </ResourceCodeBlock>
              </div>
            </div>
          </div>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { HostnameGenerator } from '@/app/hostname-generators/data'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
const props = defineProps<{
  items: HostnameGenerator[]
}>()
</script>
