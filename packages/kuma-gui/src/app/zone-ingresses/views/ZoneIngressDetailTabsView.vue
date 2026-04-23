<template>
  <RouteView
    name="zone-ingress-detail-tabs-view"
    :params="{
      zone: '',
      proxy: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataLoader
      :src="uri(sources, `/zone-ingresses/:name`, {
        name: route.params.proxy,
      })"
      v-slot="{ data: [zoneIngress] }"
    >
      <AppView
        :docs="t('zone-ingresses.href.docs')"
        :breadcrumbs="[
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
          {
            to: {
              name: 'zone-ingress-list-view',
              params: {
                zone: route.params.zone,
              },
            },
            text: t('zone-ingresses.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          #title
        >
          <DataLoader
            :src="uri(sources, `/zone-ingress-overviews/:name`, {
              name: zoneIngress.id,
            })"
            variant="header"
            v-slot="{ data: [zoneIngressOverview] }"
          >
            <XLayout
              variant="y-stack"
              size="small"
            >
              <h1>
                <XCopyButton
                  :text="zoneIngressOverview.name"
                >
                  <RouteTitle
                    :title="t('zone-ingresses.routes.item.title', { name: zoneIngressOverview.name })"
                  />
                </XCopyButton>
              </h1>
              <XBadge
                :appearance="t(`common.status.appearance.${zoneIngressOverview.state}`, undefined, { defaultMessage: 'neutral' })"
              >
                {{ t(`http.api.value.${zoneIngressOverview.state}`) }}
              </XBadge>
            </XLayout>
          </DataLoader>
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
                    :title="t('zone-ingresses.routes.item.download.title')"
                    @cancel="toggle"
                  >
                    <fieldset
                      :disabled="downloading"
                    >
                      <XI18n
                        path="zone-ingresses.routes.item.download.description"
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
                              {{ t(`zone-ingresses.routes.item.download.options.${key}`) }}
                            </XCheckbox>
                            <ul
                              v-if="key === 'xds'"
                            >
                              <li>
                                <XCheckbox
                                  v-model="specs.eds"
                                  :disabled="!specs.xds"
                                >
                                  {{ t('zone-ingresses.routes.item.download.options.eds') }}
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
                        variant="separated"
                      >
                        <XDownload
                          @start="toggle"
                          v-slot="{ download: bundle }"
                        >
                          <DataLoader
                            variant="spinner"
                            :src="downloading ? uri(sources, '/zone-ingresses/:name/as/tarball/:spec', {
                              name: zoneIngress.id,
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
                          {{ t('zone-ingresses.routes.item.download.action') }}
                        </XAction>
                      </XLayout>
                    </template>
                  </XModal>
                </form>
              </XDisclosure>
            </XTeleportTemplate>
          </XDisclosure>
        </template>

        <DataSource
          :src="uri(sources, '/zone-ingress-overviews/:name', {
            name: zoneIngress.id,
          })"
          variant="header"
          v-slot="{ data, result, error }"
        >
          <XTabs
            :selected="route.child()?.name"
            data-testid="zone-ingress-tabs"
          >
            <template
              v-for="{ name } in route.children"
              :key="name"
              #[`${name}-tab`]
            >
              <XAction
                :to="{ name }"
              >
                {{ t(`zone-ingresses.routes.item.navigation.${name}`) }}
              </XAction>
            </template>
          </XTabs>

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :networking="error ?? data?.zoneIngress.networking"
              :data="result"
              :subscriptions="data?.zoneIngressInsight?.subscriptions"
            />
          </RouterView>
        </DataSource>
      </AppView>
    </DataLoader>
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

