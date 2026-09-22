<template>
  <RouteView
    name="mesh-zone-address-list-view"
    :params="{
      mesh: '',
      mza: '',
      page: 1,
      size: 15,
      s: '',
    }"
    v-slot="{ route, uri, me }"
  >
    <XI18n
      prefix="mesh-zone-addresses"
      v-slot="{ t }"
    >
      <AppView
        :docs="t('.href.docs')"
      >
        <RouteTitle
          :title="t('.routes.items.title')"
          :render="false"
        />

        <XI18n
          path="mesh-zone-addresses.routes.items.intro"
        />

        <XCard>
          <XLayout variant="y-stack">
            <search>
              <form
                @submit.prevent
              >
                <XSearch
                  :keys="['name', 'namespace', 'label']"
                  :value="route.params.s"
                  @change="(s) => route.update({ s, page: 1 })"
                />
              </form>
            </search>

            <DataLoader
              :src="uri(sources, '/mesh-zone-addresses/for/mesh/:mesh', {
                mesh: route.params.mesh,
              }, {
                page: route.params.page,
                size: route.params.size,
                search: route.params.s,
              })"
              variant="list"
              v-slot="{ data: [data] }"
            >
              <DataCollection
                type="mesh-zone-addresses"
                :items="data.items"
                :page="route.params.page"
                :page-size="route.params.size"
                :total="data.total"
                @change="route.update"
              >
                <AppCollection
                  data-testid="mesh-zone-address-collection"
                  :headers="[
                    { ...me.get('headers.name'), label: 'Zone Name', key: 'name' },
                    { ...me.get('headers.namespace'), label: t('http.api.property.namespace'), key: 'namespace' },
                    { ...me.get('headers.address'), label: t('http.api.property.address'), key: 'address' },
                    { ...me.get('headers.port'), label: t('http.api.property.port'), key: 'port' },
                    { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :items="data.items"
                  @resize="me.set"
                >
                  <template #name="{ row: item }">
                    <XAction
                      data-action
                      :href="`kri://${item.zone.kri}`"
                    >
                      {{ item.zone.name }}
                    </XAction>
                  </template>

                  <template #address="{ row: item }">
                    <XCopyButton
                      :text="item.spec.address"
                    />
                  </template>

                  <template #port="{ row: item }">
                    <KumaPort
                      :port="{ port: item.spec.port }"
                    />
                  </template>

                  <template #actions="{ row: item }">
                    <XActionGroup>
                      <XAction
                        :href="`kri://${item.zone.kri}`"
                      >
                        {{ t('common.collection.actions.view') }}
                      </XAction>
                    </XActionGroup>
                  </template>
                </AppCollection>
              </DataCollection>
            </DataLoader>
          </XLayout>
        </XCard>
      </AppView>
    </XI18n>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
</script>
