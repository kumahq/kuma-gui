<template>
  <RouteView
    v-slot="{ route, t }"
    name="mesh-service-summary-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.service"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template #title>
            <h2>
              <XAction
                :to="{
                  name: 'mesh-service-detail-view',
                  params: {
                    mesh: route.params.mesh,
                    service: route.params.service,
                  },

                }"
              >
                <RouteTitle
                  :title="t('services.routes.item.title', { name: item.name })"
                />
              </XAction>
            </h2>
          </template>

          <div
            class="stack"
          >
            <div
              class="stack-with-borders"
            >
              <DefinitionCard
                v-if="item.status.addresses.length > 0"
                layout="horizontal"
              >
                <template
                  #title
                >
                  Addresses
                </template>
                <template
                  #body
                >
                  <KTruncate>
                    <span
                      v-for="address in item.status.addresses"
                      :key="address.hostname"
                    >
                      {{ address.hostname }}
                    </span>
                  </KTruncate>
                </template>
              </DefinitionCard>
              <DefinitionCard
                layout="horizontal"
              >
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
                      v-for="connection in item.spec.ports"
                      :key="connection.port"
                      appearance="info"
                    >
                      {{ connection.port }}:{{ connection.targetPort }}/{{ connection.appProtocol }}
                    </KBadge>
                  </KTruncate>
                </template>
              </DefinitionCard>
              <DefinitionCard
                layout="horizontal"
              >
                <template
                  #title
                >
                  Dataplane Tags
                </template>
                <template
                  #body
                >
                  <KTruncate>
                    <KBadge
                      v-for="(value, key) in item.spec.selector.dataplaneTags"
                      :key="`${key}:${value}`"
                      appearance="info"
                    >
                      {{ key }}:{{ value }}
                    </KBadge>
                  </KTruncate>
                </template>
              </DefinitionCard>
            </div>
            <div>
              <h3>
                {{ t('services.routes.item.config') }}
              </h3>

              <div class="mt-4">
                <ResourceCodeBlock
                  v-slot="{ copy, copying }"
                  :resource="item.config"
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
                    :src="`/meshes/${route.params.mesh}/mesh-service/${route.params.service}/as/kubernetes?no-store`"
                    @change="(data) => {
                      copy((resolve) => resolve(data))
                    }"
                    @error="(e) => {
                      copy((_resolve, reject) => reject(e))
                    }"
                  />
                </ResourceCodeBlock>
              </div>
            </div>
          </div>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import { MeshService } from '@/app/services/data'
const props = defineProps<{
  items: MeshService[]
}>()
</script>
