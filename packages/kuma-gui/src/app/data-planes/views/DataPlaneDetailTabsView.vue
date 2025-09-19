<template>
  <RouteView
    name="data-plane-detail-tabs-view"
    :params="{
      mesh: '',
      proxy: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh,
        },
        {
          to: {
            name: 'data-plane-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('data-planes.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template
        v-if="data"
        #title
      >
        <XLayout size="small">
          <h1>
            <XCopyButton
              :text="props.data.name"
            >
              <RouteTitle
                :title="t('data-planes.routes.item.title', { name: props.data.name })"
              />
            </XCopyButton>
          </h1>
          <XBadge
            :appearance="t(`common.status.appearance.${props.data.status}`, undefined, { defaultMessage: 'neutral' })"
          >
            {{ t(`http.api.value.${props.data.status}`) }}
          </XBadge>
        </XLayout>
      </template>
      <template
        #actions
      >
        <XDisclosure
          v-slot="{ expanded, toggle }"
        >
          <XAction
            appearance="primary"
            @click="toggle"
          >
            Download bundle
          </XAction>
          <XTeleportTemplate
            v-if="expanded"
            :to="{ name: 'modal-layer' }"
          >
            <XDisclosure
              v-slot="{ expanded: downloading, toggle: download }"
            >
              <form
                @submit.prevent="download"
              >
                <XModal
                  :title="t('data-planes.routes.item.download.title')"
                  @cancel="toggle"
                >
                  <fieldset
                    :disabled="downloading"
                  >
                    <XI18n
                      path="data-planes.routes.item.download.description"
                    />
                    <ul>
                      <template
                        v-for="(spec, key) in specs"
                        :key="typeof spec"
                      >
                        <li
                          v-if="key !== 'eds'"
                        >
                          <XCheckbox
                            v-model="specs[key]"
                            @change="(bool: boolean) => {
                              if(key === 'xds' && !bool) {
                                specs.eds = false
                              }
                            }"
                          >
                            {{ t(`data-planes.routes.item.download.options.${key}`) }}
                          </XCheckbox>
                          <ul
                            v-if="key === 'xds'"
                          >
                            <li>
                              <XCheckbox
                                v-model="specs.eds"
                                :disabled="!specs.xds"
                              >
                                {{ t('data-planes.routes.item.download.options.eds') }}
                              </XCheckbox>
                            </li>
                          </ul>
                        </li>
                      </template>
                    </ul>
                  </fieldset>
                  <template
                    #footer-actions
                  >
                    <XLayout
                      type="separated"
                    >
                      <XDownload
                        @start="toggle"
                        v-slot="{ download: bundle }"
                      >
                        <DataLoader
                          variant="spinner"
                          :src="downloading ? uri(sources, '/meshes/:mesh/dataplanes/:name/as/tarball/:spec', {
                            mesh: route.params.mesh,
                            name: route.params.proxy,
                            spec: JSON.stringify(
                              specs,
                            ),
                          }, {
                            cacheControl: 'no-cache',
                          }) : ''"
                          @change="bundle"
                          @error="download"
                        >
                          <template
                            #error
                          >
                            <XAlert
                              appearance="warning"
                              show-icon
                            >
                              <XI18n
                                t="data-planes.routes.item.download.error"
                              />
                            </XAlert>
                          </template>
                        </DataLoader>
                      </XDownload>
                      <XAction
                        appearance="primary"
                        type="submit"
                        :disabled="downloading || Object.values(specs).every(bool => !bool)"
                      >
                        {{ t('data-planes.routes.item.download.action') }}
                      </XAction>
                    </XLayout>
                  </template>
                </XModal>
              </form>
            </XDisclosure>
          </XTeleportTemplate>
        </XDisclosure>
      </template>

      <XTabs
        :selected="route.child()?.name"
      >
        <template
          v-for="{ name } in route.children"
          :key="name"
          #[`${name}-tab`]
        >
          <XAction
            :to="{ name }"
          >
            {{ t(`data-planes.routes.item.navigation.${name}`) }}
          </XAction>
        </template>
      </XTabs>

      <RouterView
        v-slot="{ Component }"
      >
        <component
          :is="Component"
          :data="props.data"
          :networking="props.data.dataplane.networking"
          :mesh="props.mesh"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { DataplaneOverview } from '../data'
import { sources } from '../sources'
import type { Mesh } from '@/app/meshes/data'
const props = defineProps<{
  data: DataplaneOverview
  mesh: Mesh
}>()

const specs = ref({
  eds: false,
  xds: true,
  clusters: true,
  stats: true,
  proxy: true,
  policies: true,
})
</script>
<style lang="scss" scoped>
  form {
    :deep(p) {
      margin-bottom: 1em !important;
    }
    ul {
      margin: 0;
      list-style-type: none;
    }
  }
</style>
