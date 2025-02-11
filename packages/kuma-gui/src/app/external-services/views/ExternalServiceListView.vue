<template>
  <RouteView
    name="external-service-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
    }"
    v-slot="{ route, t, me, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t(`external-services.routes.items.title`)"
    />
    <AppView
      :docs="t('external-services.href.docs')"
    >
      <XCard>
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/external-services`, {
            mesh: route.params.mesh,
          }, {
            page: route.params.page,
            size: route.params.size,
          })"
        >
          <template
            #loadable="{ data }"
          >
            <DataCollection
              type="external-services"
              :items="data?.items ?? [undefined]"
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              @change="route.update"
            >
              <AppCollection
                class="external-service-collection"
                data-testid="external-service-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.address'), label: 'Address', key: 'address' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="data?.items"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XCopyButton :text="item.name">
                    <XAction
                      :to="{
                        name: 'external-service-detail-view',
                        params: {
                          mesh: item.mesh,
                          service: item.name,
                        },
                        query: {
                          page: route.params.page,
                          size: route.params.size,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </XCopyButton>
                </template>

                <template #address="{ row }">
                  <XCopyButton
                    v-if="row.networking.address"
                    :text="row.networking.address"
                  />

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'external-service-detail-view',
                        params: {
                          mesh: item.mesh,
                          service: item.name,
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </AppCollection>
            </DataCollection>
          </template>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
</script>
