<template>
  <RouteView
    name="mesh-external-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, can, t, uri, me }"
  >
    <AppView>
      <XLayout type="stack">
        <XAboutCard
          :title="t('services.mesh-external-service.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
        >
          <DefinitionCard
            v-if="props.data.namespace.length > 0"
            layout="horizontal"
          >
            <template
              #title
            >
              {{ t('http.api.property.namespace') }}
            </template>

            <template
              #body
            >
              <XBadge appearance="decorative">
                {{ props.data.namespace }}
              </XBadge>
            </template>
          </DefinitionCard>
          <DefinitionCard
            v-if="can('use zones') && props.data.zone"
            layout="horizontal"
          >
            <template
              #title
            >
              {{ t('http.api.property.zone') }}
            </template>
            <template
              #body
            >
              <XBadge appearance="decorative">
                <XAction
                  :to="{
                    name: 'zone-cp-detail-view',
                    params: {
                      zone: props.data.zone,
                    },
                  }"
                >
                  {{ props.data.zone }}
                </XAction>
              </XBadge>
            </template>
          </DefinitionCard>
          <DefinitionCard
            v-if="data.spec.match"
            layout="horizontal"
            class="port"
          >
            <template
              #title
            >
              {{ t('http.api.property.port') }}
            </template>
            <template
              #body
            >
              <KumaPort
                :port="data.spec.match"
              />
            </template>
          </DefinitionCard>
          <DefinitionCard
            v-if="data.spec.match"
            layout="horizontal"
            class="tls"
          >
            <template
              #title
            >
              {{ t('http.api.property.tls') }}
            </template>
            <template
              #body
            >
              <XBadge
                :appearance="data.spec.tls?.enabled ? 'success' : 'neutral'"
              >
                {{ data.spec.tls?.enabled ? 'Enabled' : 'Disabled' }}
              </XBadge>
            </template>
          </DefinitionCard>
        </XAboutCard>


        
        <XCard>
          <template #title>
            {{ t('services.detail.hostnames.title') }}
          </template>

          <DataLoader
            :src="uri(servicesSources, '/meshes/:mesh/:serviceType/:serviceName/_hostnames', {
              mesh: route.params.mesh,
              serviceType: 'meshexternalservices',
              serviceName: route.params.service,
            })"
          >
            <template #loadable="{ data: inspectHostnames }">
              <DataCollection
                type="inspect-hostnames"
                :items="inspectHostnames?.items ?? [undefined]"
              >
                <AppCollection
                  type="inspect-hostname-collection"
                  data-testid="inspect-hostnames-collection"
                  :items="inspectHostnames?.items"
                  :headers="[
                    { ...me.get('headers.hostname'), label: t('services.detail.hostnames.hostname'), key: 'hostname' },
                    { ...me.get('headers.zones'), label: t('services.detail.hostnames.zone'), key: 'zones' },
                  ]"
                  @resize="me.set"
                >
                  <template #hostname="{ row: item }">
                    <b>
                      <XCopyButton
                        :text="item.hostname"
                      />
                    </b>
                  </template>
                  <template #zones="{ row: item }">
                    <XLayout type="separated">
                      <XBadge
                        v-for="(zone, index) of item.zones"
                        :key="index"
                        appearance="decorative"
                      >
                        <XAction
                          :to="{
                            name: 'zone-cp-detail-view',
                            params: {
                              zone: zone.name,
                            },
                          }"
                        >
                          {{ zone.name }}
                        </XAction>
                      </XBadge>
                    </XLayout>
                  </template>
                </AppCollection>
              </DataCollection>
            </template>
          </DataLoader>
        </XCard>

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
            :src="`/meshes/${props.data.mesh}/mesh-external-service/${props.data.id}/as/kubernetes?no-store`"
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
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshExternalService } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import { sources as servicesSources } from '@/app/services/sources'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  data: MeshExternalService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
}
</style>
