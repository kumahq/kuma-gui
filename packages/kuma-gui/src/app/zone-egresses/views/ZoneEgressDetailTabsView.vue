<template>
  <RouteView
    name="zone-egress-detail-tabs-view"
    :params="{
      zone: '',
      proxy: '',
    }"
    v-slot="{ route, can, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/zone-egress-overviews/:name', {
        name: route.params.proxy,
      })"
      v-slot="{ data, error }"
    >
      <AppView
        :docs="t('zone-ingresses.href.docs')"
        :breadcrumbs="[
          ...(can('use zones') ? [
            {
              to: {
                name: 'zone-cp-list-view',
              },
              text: t('zone-cps.routes.item.breadcrumbs'),
            },
            {
              to: {
                name: 'zone-cp-detail-view',
                params: {
                  zone: route.params.zone,
                },
              },
              text: route.params.zone,
            },
          ] : []),
          {
            to: {
              name: 'zone-egress-list-view',
              params: {
                zone: route.params.zone,
              },
            },
            text: t('zone-egresses.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          #title
        >
          <h1
            v-if="data"
          >
            <XCopyButton :text="data.name">
              <RouteTitle
                :title="t('zone-egresses.routes.item.title', { name: data.name })"
              />
            </XCopyButton>
          </h1>
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
              Download Bundle
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
                    :title="t('zone-egresses.routes.item.download.title')"
                    @cancel="toggle"
                  >
                    <fieldset
                      :disabled="downloading"
                    >
                      <XI18n
                        path="zone-egresses.routes.item.download.description"
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
                              {{ t(`zone-egresses.routes.item.download.options.${key}`) }}
                            </XCheckbox>
                            <ul
                              v-if="key === 'xds'"
                            >
                              <li>
                                <XCheckbox
                                  v-model="specs.eds"
                                  :disabled="!specs.xds"
                                >
                                  {{ t('zone-egresses.routes.item.download.options.eds') }}
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
                            :src="downloading ? uri(sources, '/zone-egresses/:name/as/tarball/:spec', {
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
                                  t="zone-ingresses.routes.item.download.error"
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
                          {{ t('zone-egresses.routes.item.download.action') }}
                        </XAction>
                      </XLayout>
                    </template>
                  </XModal>
                </form>
              </XDisclosure>
            </XTeleportTemplate>
          </XDisclosure>
        </template>

        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
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
                {{ t(`zone-egresses.routes.item.navigation.${name}`) }}
              </XAction>
            </template>
          </XTabs>

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :networking="data?.zoneEgress.networking"
              :data="data"
            />
          </RouterView>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { sources } from '../sources'
const specs = ref({
  eds: false,
  xds: true,
  clusters: true,
  stats: true,
  proxy: true,
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

