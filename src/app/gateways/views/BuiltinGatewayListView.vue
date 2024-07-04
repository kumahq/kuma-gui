<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, can }"
      name="builtin-gateway-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        gateway: '',
      }"
    >
      <DataSource
        v-slot="{ data, error }: MeshGatewayCollectionSource"
        :src="`/meshes/${route.params.mesh}/mesh-gateways?page=${route.params.page}&size=${route.params.size}`"
      >
        <AppView>
          <KCard>
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <AppCollection
              v-else
              class="builtin-gateway-collection"
              data-testid="builtin-gateway-collection"
              :empty-state-message="t('common.emptyState.message', { type: 'Built-in Gateways' })"
              :empty-state-cta-to="t('builtin-gateways.href.docs')"
              :empty-state-cta-text="t('common.documentation')"
              :headers="[
                { label: 'Name', key: 'name' },
                ...(can('use zones') ? [{ label: 'Zone', key: 'zone' }] : []),
                { label: 'Actions', key: 'actions', hideLabel: true },
              ]"
              :page-number="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              :items="data?.items"
              :error="error"
              @change="route.update"
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
          </KCard>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import type { MeshGatewayCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
</script>
