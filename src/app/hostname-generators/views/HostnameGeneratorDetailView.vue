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
              <DefinitionCard>
                <template #title>
                  {{ t('hostname-generators.common.selector') }}
                </template>

                <template
                  v-if="data.selector"
                  #body
                >
                  <XAction
                    :to="{
                      name: routeMap.get(data.selector),
                      params: {
                        mesh: data.mesh,
                      },
                    }"
                  >
                    {{ `${data.selector.charAt(0).toUpperCase()}${data.selector.slice(1, data.selector.length)}` }}
                  </XAction>
                </template>
              </DefinitionCard>
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

import { HostnameGenerator } from '../data'
import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const routeMap = new Map<HostnameGenerator['selector'], string>([
  ['meshService', 'mesh-service-list-view'],
  ['meshExternalService', 'mesh-external-service-list-view'],
  ['meshMultiZoneService', 'mesh-multi-zone-service-list-view'],
])
</script>

<style lang="scss" scoped>
:deep(.kong-ui-app-about-section .about-section-content) {
  display: block;
}
</style>
