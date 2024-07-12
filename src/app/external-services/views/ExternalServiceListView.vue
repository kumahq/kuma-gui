<template>
  <RouteView
    v-slot="{ route, t, me, uri }"
    name="external-service-list-view"
    :params="{
      page: 1,
      size: 50,
      mesh: '',
    }"
  >
    <RouteTitle
      :render="false"
      :title="t(`external-services.routes.items.title`)"
    />
    <AppView>
      <KCard>
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
            >
              <AppCollection
                class="external-service-collection"
                data-testid="external-service-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.address'), label: 'Address', key: 'address' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="route.params.page"
                :page-size="route.params.size"
                :total="data?.total"
                :items="data?.items"
                @change="route.update"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <TextWithCopyButton :text="item.name">
                    <RouterLink
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
                    </RouterLink>
                  </TextWithCopyButton>
                </template>

                <template #address="{ row }">
                  <TextWithCopyButton
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
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
