<template>
  <RouteView
    name="mesh-multi-zone-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t }"
  >
    <AppView>
      <XLayout type="stack">
        <XAboutSection
          :title="t('services.mesh-multi-zone-service.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
        >
          <DefinitionCard layout="horizontal">
            <template
              #title
            >
              {{ t('http.api.property.ports') }}
            </template>
            <template
              #body
            >
              <template v-if="props.data.spec.ports.length">
                <KumaPort
                  v-for="connection in props.data.spec.ports"
                  :key="connection.port"
                  :port="{
                    ...connection,
                    targetPort: undefined,
                  }"
                />
              </template>
              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>
          <DefinitionCard layout="horizontal">
            <template
              #title
            >
              {{ t('http.api.property.selector') }}
            </template>
            <template
              #body
            >
              <template v-if="Object.keys(data.spec.selector.meshService.matchLabels).length">
                <XBadge
                  v-for="(value, key) in data.spec.selector.meshService.matchLabels"
                  :key="`${key}:${value}`"
                  appearance="info"
                >
                  {{ key }}:{{ value }}
                </XBadge>
              </template>
              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>
        </XAboutSection>

        <div>
          <ResourceCodeBlock
            :resource="props.data.config"
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
              :src="`/meshes/${props.data.mesh}/mesh-multi-zone-service/${props.data.id}/as/kubernetes?no-store`"
              @change="(data) => {
                copy((resolve) => resolve(data))
              }"
              @error="(e) => {
                copy((_resolve, reject) => reject(e))
              }"
            />
          </ResourceCodeBlock>
        </div>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshMultiZoneService } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  data: MeshMultiZoneService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
}

.name-link {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
