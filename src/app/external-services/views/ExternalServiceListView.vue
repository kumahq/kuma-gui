<template>
  <RouteView
    v-slot="{ route, t, me }"
    name="external-service-list-view"
    :params="{
      page: 1,
      size: 50,
      mesh: '',
    }"
  >
    <DataSource
      v-slot="{data, error}: ExternalServiceCollectionSource"
      :src="`/meshes/${route.params.mesh}/external-services?page=${route.params.page}&size=${route.params.size}`"
    >
      <RouteTitle
        :render="false"
        :title="t(`external-services.routes.items.title`)"
      />
      <AppView>
        <KCard>
          <ErrorBlock
            v-if="error !== undefined"
            :error="error"
          />

          <AppCollection
            v-else
            class="external-service-collection"
            data-testid="external-service-collection"
            :empty-state-message="t('common.emptyState.message', { type: 'External Services' })"
            :empty-state-cta-to="t('external-services.href.docs')"
            :empty-state-cta-text="t('common.documentation')"
            :headers="[
              { ...me.get('headers.name'), label: 'Name', key: 'name' },
              { ...me.get('headers.address'), label: 'Address', key: 'address' },
              { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
            ]"
            :page-number="route.params.page"
            :page-size="route.params.size"
            :total="data?.total"
            :items="data?.items"
            :error="error"
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
        </KCard>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ExternalServiceCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
