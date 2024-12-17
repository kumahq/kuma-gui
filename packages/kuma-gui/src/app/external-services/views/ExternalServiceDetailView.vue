<template>
  <RouteView
    name="external-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <AppView>
      <div
        class="stack"
      >
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/external-services/:name`, {
            mesh: route.params.mesh,
            name: route.params.service,
          })"
          v-slot="{ data }"
        >
          <XAboutSection
            data-testid="external-service-details"
            :title="t('external-services.detail.about.title')"
            :created="t('common.formats.datetime', { value: Date.parse(data.creationTime)})"
            :modified="t('common.formats.datetime', { value: Date.parse(data.modificationTime)})"
          >
            <DefinitionCard layout="horizontal">
              <template #title>
                {{ t('http.api.property.address') }}:
              </template>

              <template #body>
                <XBadge appearance="decorative">
                  <TextWithCopyButton :text="data.networking.address" />
                </XBadge>
              </template>
            </DefinitionCard>

            <DefinitionCard
              v-if="data.tags"
              layout="horizontal"
            >
              <template #title>
                {{ t('http.api.property.tags') }}:
              </template>

              <template #body>
                <TagList :tags="data.tags" />
              </template>
            </DefinitionCard>
          </XAboutSection>

          <div>
            <h3>{{ t('external-services.detail.config') }}</h3>

            <ResourceCodeBlock
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
              v-slot="{ copy, copying }"
            >
              <DataSource
                v-if="copying"
                :src="uri(sources, `/meshes/:mesh/external-services/:name/as/kubernetes`, {
                  mesh: route.params.mesh,
                  name: route.params.service,
                }, {
                  cacheControl: 'no-store',
                })"
                @change="(data) => {
                  copy((resolve) => resolve(data))
                }"
                @error="(error) => {
                  copy((_resolve, reject) => reject(error))
                }"
              />
            </ResourceCodeBlock>
          </div>
        </DataLoader>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
</script>
