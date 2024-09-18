<template>
  <RouteView
    name="mesh-external-service-detail-view"
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, can }"
  >
    <AppView>
      <div
        class="stack"
      >
        <KCard>
          <div class="columns">
            <DefinitionCard
              v-if="props.data.namespace.length > 0"
            >
              <template #title>
                Namespace
              </template>

              <template #body>
                {{ props.data.namespace }}
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="can('use zones') && props.data.zone"
            >
              <template
                #title
              >
                Zone
              </template>
              <template
                #body
              >
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
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="data.spec.match"
              class="port"
            >
              <template
                #title
              >
                Port
              </template>
              <template
                #body
              >
                <KBadge
                  v-for="connection in [data.spec.match]"
                  :key="connection.port"
                  appearance="info"
                >
                  {{ connection.port }}/{{ connection.protocol }}
                </KBadge>
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="data.spec.match"
              class="tls"
            >
              <template
                #title
              >
                TLS
              </template>
              <template
                #body
              >
                <KBadge
                  appearance="neutral"
                >
                  {{ data.spec.tls?.enabled ? 'Enabled' : 'Disabled' }}
                </KBadge>
              </template>
            </DefinitionCard>
          </div>
        </KCard>
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
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshExternalService } from '../data'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

const props = defineProps<{
  data: MeshExternalService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
}
</style>
