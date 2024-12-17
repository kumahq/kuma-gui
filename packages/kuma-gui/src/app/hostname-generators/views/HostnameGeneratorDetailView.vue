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
      :src="uri(sources, '/hostname-generators/:name', {
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
        <XLayout
          type="stack"
        >
          <XAboutSection
            :title="t('hostname-generators.routes.item.about.title')"
            :created="t('common.formats.datetime', { value: Date.parse(data.creationTime) })"
            :modified="t('common.formats.datetime', { value: Date.parse(data.modificationTime) })"
          >
            <template
              v-for="labels in [{
                ...data.spec.selector.meshService.matchLabels,
                ...data.spec.selector.meshExternalService.matchLabels,
                ...data.spec.selector.meshMultiZoneService.matchLabels,
              }]"
              :key="typeof labels"
            >
              <DefinitionCard
                v-if="Object.keys(labels).length"
                layout="horizontal"
              >
                <template #title>
                  {{ t('http.api.property.tags') }}
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
          </XAboutSection>

          <ResourceCodeBlock
            :resource="data.$raw"
            v-slot="{ copy, copying }"
          >
            <DataSource
              v-if="copying"
              :src="uri(sources, '/hostname-generators/:name/as/kubernetes', {
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
        </XLayout>
      </AppView>
    </DataLoader>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
</script>
