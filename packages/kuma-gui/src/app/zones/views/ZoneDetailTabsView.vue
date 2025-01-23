<template>
  <RouteView
    name="zone-cp-detail-tabs-view"
    :params="{
      zone: '',
    }"
    v-slot="{ can, route, t }"
  >
    <DataLoader
      :src="`/zone-cps/${route.params.zone}`"
      v-slot="{ data }: ZoneOverviewSource"
    >
      <AppView
        v-if="data"
        :breadcrumbs="[
          {
            to: {
              name: 'zone-cp-list-view',
            },
            text: t('zone-cps.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template #title>
          <h1>
            <XCopyButton :text="route.params.zone">
              <RouteTitle
                :title="t('zone-cps.routes.item.title', { name: route.params.zone })"
              />
            </XCopyButton>
          </h1>
        </template>

        <template
          v-if="can('create zones')"
          #actions
        >
          <XActionGroup>
            <template
              #control
            >
              <XAction
                action="expand"
                appearance="primary"
              >
                {{ t('zones.action_menu.toggle_button') }}
              </XAction>
            </template>
            <XDisclosure
              v-slot="{ expanded, toggle }"
            >
              <XAction
                appearance="danger"
                data-testid="delete-button"
                @click="toggle"
              >
                {{ t('zones.action_menu.delete_button') }}
              </XAction>
              <XTeleportTemplate
                :to="{ name: 'modal-layer' }"
              >
                <DataSink
                  v-if="expanded"
                  :src="`/zone-cps/${data.name}/delete`"
                  @change="() => route.replace({ name: 'zone-cp-list-view' })"
                  v-slot="{ submit, error }"
                >
                  <XPrompt
                    :action="t('common.delete_modal.proceed_button')"
                    :expected="data.name"
                    data-testid="delete-zone-modal"
                    @cancel="toggle"
                    @submit="() => submit({})"
                  >
                    <template
                      #title
                    >
                      {{ t('common.delete_modal.title', { type: 'Zone' }) }}
                    </template>
                    <XI18n
                      path="common.delete_modal.text"
                      :params="{
                        type: 'Zone',
                        name: data.name,
                      }"
                    />
                    <DataLoader
                      class="mt-4"
                      :errors="[error]"
                      :loader="false"
                    />
                  </XPrompt>
                </DataSink>
              </XTeleportTemplate>
            </XDisclosure>
          </XActionGroup>
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
              {{ t(`zone-cps.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView v-slot="child">
          <component
            :is="child.Component"
            :data="data"
          />
        </RouterView>
      </AppView>
    </DataLoader>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneOverviewSource } from '../sources'
</script>
