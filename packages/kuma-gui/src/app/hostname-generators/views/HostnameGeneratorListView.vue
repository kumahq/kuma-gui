<template>
  <RouteView
    name="hostname-generator-list-view"
    :params="{
      name: '',
      page: 1,
      size: 15,
    }"
    v-slot="{ route, t, can, uri, me }"
  >
    <AppView
      :docs="t('hostname-generators.href.docs')"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('hostname-generators.routes.items.title')"
          />
        </h1>
      </template>
      <XI18n
        path="hostname-generators.routes.items.intro"
        default-path="common.i18n.ignore-error"
      />
      <XCard>
        <DataLoader
          :src="uri(sources, '/hostname-generators', {}, {
            page: route.params.page,
            size: route.params.size,
          })"
        >
          <template
            #loadable="{ data }"
          >
            <DataCollection
              type="hostname-generators"
              :items="data?.items ?? [undefined]"
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              @change="(value) => {
                let { page } = value
                if(route.params.size !== value.size) {
                  const offset = route.params.size * Math.max(route.params.page - 1, 0)
                  page = Math.floor(offset / value.size) + 1
                }
                return route.update({
                  ...value, page,
                })
              }"
            >
              <AppCollection
                data-testid="hostname-generator-collection"
                :headers="[
                  { ...me.get('headers.name'), label: t('hostname-generators.common.name'), key: 'name' },
                  { ...me.get('headers.namespace'), label: t('hostname-generators.common.namespace'), key: 'namespace' },
                  ...(can('use zones') ? [{ ...me.get('headers.zone'), label: t('hostname-generators.common.zone'), key: 'zone' }] : []),
                  { ...me.get('headers.actions'), label: t('hostname-generators.common.actions'), key: 'actions', hideLabel: true },
                ]"
                :items="data?.items"
                :is-selected-row="(item) => item.name === route.params.name"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XCopyButton
                    :text="item.name"
                  >
                    <XAction
                      data-action
                      :to="{
                        name: 'hostname-generator-summary-view',
                        params: {
                          name: item.id,
                        },
                        query: {
                          page: route.params.page,
                          size: route.params.size,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </XCopyButton>
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'hostname-generator-detail-view',
                        params: {
                          name: item.id,
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </AppCollection>
              <RouterView
                v-if="data?.items && route.params.name"
                v-slot="child"
              >
                <SummaryView
                  @close="route.replace({
                    name: 'hostname-generator-list-view',
                    params: {
                      name: '',
                    },
                    query: {
                      page: route.params.page,
                      size: route.params.size,
                    },
                  })"
                >
                  <component
                    :is="child.Component"
                    :items="data?.items"
                  />
                </SummaryView>
              </RouterView>
            </DataCollection>
          </template>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import XCopyButton from '@/app/x/components/x-copy-button/XCopyButton.vue'
</script>
