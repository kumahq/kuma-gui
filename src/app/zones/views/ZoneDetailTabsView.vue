<template>
  <RouteView
    v-slot="{ can, route, t }"
    name="zone-cp-detail-tabs-view"
    :params="{
      zone: '',
    }"
  >
    <DataLoader
      v-slot="{ data }: ZoneOverviewSource"
      :src="`/zone-cps/${route.params.zone}`"
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
            <TextWithCopyButton :text="route.params.zone">
              <RouteTitle
                :title="t('zone-cps.routes.item.title', { name: route.params.zone })"
              />
            </TextWithCopyButton>
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
                type="expand"
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
                <DeleteResourceModal
                  v-if="expanded"
                  :confirmation-text="data.name"
                  :delete-function="() => deleteZone(data.name)"
                  is-visible
                  :action-button-text="t('common.delete_modal.proceed_button')"
                  :title="t('common.delete_modal.title', { type: 'Zone' })"
                  data-testid="delete-zone-modal"
                  @cancel="toggle"
                  @delete="() => route.replace({ name: 'zone-cp-list-view' })"
                >
                  <p>{{ t('common.delete_modal.text1', { type: 'Zone', name: data.name }) }}</p>

                  <p>{{ t('common.delete_modal.text2') }}</p>
                </DeleteResourceModal>
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
import DeleteResourceModal from '@/app/common/DeleteResourceModal.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useKumaApi } from '@/app/kuma'

const kumaApi = useKumaApi()
async function deleteZone(name: string) {
  // Intentionally not wrapped in a try-catch block so that the DeleteResourceModal can discover when the operation failed.
  await kumaApi.deleteZone({ name })
}

</script>
