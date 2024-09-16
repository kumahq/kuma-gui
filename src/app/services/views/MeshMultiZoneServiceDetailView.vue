<template>
  <RouteView
    name="mesh-multi-zone-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      page: 1,
      size: 50,
      s: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ t, me, can }"
  >
    <AppView>
      <div
        class="stack"
      >
        <KCard>
          <div class="columns">
            <DefinitionCard>
              <template
                #title
              >
                Ports
              </template>
              <template
                #body
              >
                <KTruncate>
                  <KBadge
                    v-for="connection in props.data.spec.ports"
                    :key="connection.port"
                    appearance="info"
                  >
                    {{ connection.port }}/{{ connection.appProtocol }}{{ connection.name && connection.name !== String(connection.port) ? ` (${connection.name})` : '' }}
                  </KBadge>
                </KTruncate>
              </template>
            </DefinitionCard>
            <DefinitionCard>
              <template
                #title
              >
                Selector
              </template>
              <template
                #body
              >
                <KTruncate>
                  <KBadge
                    v-for="(value, key) in data.spec.selector.meshService.matchLabels"
                    :key="`${key}:${value}`"
                    appearance="info"
                  >
                    {{ key }}:{{ value }}
                  </KBadge>
                </KTruncate>
              </template>
            </DefinitionCard>
          </div>
        </KCard>

        <div>
          <h3>
            Mesh Services
          </h3>

          <KCard
            class="mt-4"
          >
            <AppCollection
              data-testid="mesh-service-collection"
              :headers="[
                { ...me.get('headers.name'), label: 'Name', key: 'name' },
                ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
              ]"
              :items="data.status.meshServices"
              :total="data.status.meshServices.length"
              @resize="me.set"
            >
              <template #name="{ row: item }">
                <XAction
                  data-action
                  class="name-link"
                  :to="{
                    name: 'mesh-service-detail-view',
                    params: {
                      mesh: item.mesh,
                      service: item.name,
                    },
                  }"
                >
                  {{ item.name }}
                </XAction>
              </template>

              <template #zone="{ row }">
                <XAction
                  :to="{
                    name: 'zone-cp-detail-view',
                    params: {
                      zone: row.zone,
                    },
                  }"
                >
                  {{ row.zone }}
                </XAction>
              </template>

              <template #namespace="{ row: item }">
                {{ item.namespace }}
              </template>

              <template #actions="{ row: item }">
                <XActionGroup>
                  <XAction
                    :to="{
                      name: 'mesh-service-detail-view',
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
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshMultiZoneService } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

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
