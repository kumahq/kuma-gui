<template>
  <RouteView
    v-slot="{ route, t }"
    name="external-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView>
      <DataSource
        v-slot="{ data, error }: ExternalServiceSource"
        :src="`/meshes/${route.params.mesh}/external-services/${route.params.service}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <div
          v-else
          class="stack"
        >
          <KCard data-testid="external-service-details">
            <div class="columns">
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <TextWithCopyButton :text="data.networking.address" />
                </template>
              </DefinitionCard>

              <DefinitionCard v-if="data.tags">
                <template #title>
                  {{ t('http.api.property.tags') }}
                </template>

                <template #body>
                  <TagList :tags="data.tags" />
                </template>
              </DefinitionCard>
            </div>
          </KCard>

          <div>
            <h3>{{ t('external-services.detail.config') }}</h3>

            <ResourceCodeBlock
              v-slot="{ copy, copying }"
              class="mt-4"
              data-testid="external-service-config"
              :resource="data.config"
              is-searchable
              :query="route.params.codeSearch"
              :is-filter-mode="route.params.codeFilter"
              :is-reg-exp-mode="route.params.codeRegExp"
              @query-change="route.update({ codeSearch: $event })"
              @filter-mode-change="route.update({ codeFilter: $event })"
              @reg-exp-mode-change="route.update({ codeRegExp: $event })"
            >
              <DataSource
                v-if="copying"
                :src="`/meshes/${data.mesh}/external-services/${data.name}/as/kubernetes?no-store`"
                @change="(data) => {
                  copy((resolve) => resolve(data))
                }"
                @error="(error) => {
                  copy((_resolve, reject) => reject(error))
                }"
              />
            </ResourceCodeBlock>
          </div>
        </div>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
