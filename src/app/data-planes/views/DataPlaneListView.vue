<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="data-plane-list-view"
      :params="{
        page: 1,
        size: 50,
        query: '',
        s: '',
        mesh: '',
      }"
    >
      <DataSource
        v-slot="{data, error}: DataPlaneCollectionSource"
        :src="`/meshes/${route.params.mesh}/dataplanes?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
      >
        <AppView>
          <template #title>
            <h2>
              <RouteTitle
                :title="t('data-planes.routes.items.title')"
                :render="true"
              />
            </h2>
          </template>
          <KCard>
            <template #body>
              <ErrorBlock
                v-if="error !== undefined"
                :error="error"
              />

              <DataPlaneList
                v-else
                data-testid="data-plane-collection"
                class="data-plane-collection"
                :page-number="parseInt(route.params.page)"
                :page-size="parseInt(route.params.size)"
                :total="data?.total"
                :items="data?.items"
                :error="error"
                @change="route.update"
              >
                <template #toolbar>
                  <KFilterBar
                    class="data-plane-proxy-filter"
                    :placeholder="`tag: 'kuma.io/protocol: http'`"
                    :query="route.params.query"
                    :fields="{
                      name: { description: 'filter by name or parts of a name' },
                      service: { description: 'filter by “kuma.io/service” value' },
                      tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                      zone: { description: 'filter by “kuma.io/zone” value' },
                    }"
                    @fields-change="(val) => route.update({
                      query: val.query,
                      s: val.query.length > 0 ? JSON.stringify(val.fields) : '',
                    })"
                  />
                </template>
              </DataPlaneList>
            </template>
          </KCard>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import DataPlaneList from '../components/DataPlaneList.vue'
import type { DataPlaneCollectionSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import KFilterBar from '@/app/common/KFilterBar.vue'
import type { MeSource } from '@/app/me/sources'
</script>
<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
}
</style>
