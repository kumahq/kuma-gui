<template>
  <RouteView
    v-slot="{ route, t, can, me, uri }"
    name="builtin-gateway-list-view"
    :params="{
      page: 1,
      size: 50,
      mesh: '',
      gateway: '',
    }"
  >
    <AppView
      :docs="t('builtin-gateways.href.docs')"
    >
      <KCard>
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/mesh-gateways`, {
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
              type="gateways"
              :items="data?.items ?? [undefined]"
            >
              <AppCollection
                class="builtin-gateway-collection"
                data-testid="builtin-gateway-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
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
                    <XAction
                      data-action
                      :to="{
                        name: 'builtin-gateway-detail-view',
                        params: {
                          mesh: item.mesh,
                          gateway: item.name,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </TextWithCopyButton>
                </template>

                <template #zone="{ row }">
                  <template v-if="row.labels && row.labels['kuma.io/origin'] === 'zone' && row.labels['kuma.io/zone']">
                    <XAction
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: row.labels['kuma.io/zone'],
                        },
                      }"
                    >
                      {{ row.labels['kuma.io/zone'] }}
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
                        name: 'builtin-gateway-detail-view',
                        params: {
                          mesh: item.mesh,
                          gateway: item.name,
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
