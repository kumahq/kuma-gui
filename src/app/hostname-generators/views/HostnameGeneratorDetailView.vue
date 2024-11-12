<template>
  <RouteView
    name="hostname-generator-detail-view"
    :params="{
      name: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :title="t('hostname-generators.routes.items.title')"
      :render="false"
    />

    <DataLoader
      :src="uri(sources, '/hostnamegenerators/:name', {
        name: route.params.name,
      })"
      v-slot="{ data }"
    >
      <AppView :docs="t('hostname-generators.href.docs')">
        <template #title>
          <h1>
            <XCopyButton
              :text="data.name"
            >
              <RouteTitle
                :title="t('hostname-generators.routes.item.title', { name: data.name })"
              />
            </XCopyButton>
          </h1>
        </template>
        <div class="stack">
          <AppAboutSection
            :title="t('hostname-generators.routes.item.subtitle', { name: data.name })"
            :created="t('common.formats.datetime', { value: Date.parse(data.creationTime) })"
            :modified="t('common.formats.datetime', { value: Date.parse(data.modificationTime) })"
          >
            <div class="columns">
              <template
                v-for="labels in [{
                  ...data.spec.selector.meshService.matchLabels,
                  ...data.spec.selector.meshExternalService.matchLabels,
                  ...data.spec.selector.meshMultiZoneService.matchLabels,
                }]"
                :key="typeof labels"
              >
                <DefinitionCard v-if="Object.keys(labels).length">
                  <template #title>
                    Tags
                  </template>

                  <template #body>
                    <XLayout type="separated">
                      <template
                        v-for="(value, key) in labels"
                        :key="key"
                      >
                        <XBadge>
                          {{ key }}:{{ value }}
                        </XBadge>
                      </template>
                    </XLayout>
                  </template>
                </DefinitionCard>
              </template>
            </div>
          </AppAboutSection>

          <ResourceCodeBlock
            :resource="data.$raw"
            v-slot="{ copy, copying }"
          >
            <DataSource
              v-if="copying"
              :src="uri(sources, '/hostnamegenerators/:name/as/kubernetes', {
                name: route.params.name,
              }, {
                cacheControl: 'no-store',
              })"
              @change="(data) => {
                copy((resolve) => resolve(data))
              }"
              @error="(e) => {
                copy((_resolve, reject) => reject(e))
              }"
            />
          </ResourceCodeBlock>
        </div>
      </AppView>
    </DataLoader>
  </RouteView>
</template>

<script lang="ts" setup>
import { AppAboutSection } from '@kong-ui-public/app-layout'

import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
</script>

<style lang="scss" scoped>
:deep(.kong-ui-app-about-section .about-section-content) {
  display: block;
}
</style>
