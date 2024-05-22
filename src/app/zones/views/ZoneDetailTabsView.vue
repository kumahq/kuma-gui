<template>
  <RouteView
    v-slot="{ can, route }"
    name="zone-cp-detail-tabs-view"
    :params="{
      zone: '',
    }"
  >
    <DataLoader
      v-slot="{ data }: ZoneOverviewSource"
      :src="`/zone-cps/${route.params.zone}`"
      @change="change"
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
          <KDropdown
            :kpop-attributes="{ placement: 'bottomEnd' }"
            :trigger-text="t('zones.action_menu.toggle_button')"
            show-caret
            width="280"
          >
            <template #items>
              <XDisclosure
                v-slot="{ expanded, toggle }"
              >
                <KDropdownItem
                  danger
                  data-testid="delete-button"
                  @click.prevent="toggle"
                >
                  {{ t('zones.action_menu.delete_button') }}
                </KDropdownItem>
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
            </template>
          </KDropdown>
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
            :notifications="notifications"
          />
        </RouterView>
      </AppView>
    </DataLoader>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { ZoneOverview } from '../data'
import type { ZoneOverviewSource } from '../sources'
import { useI18n } from '@/app/application'
import DeleteResourceModal from '@/app/common/DeleteResourceModal.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { compare } from '@/app/control-planes/sources'
import { useKumaApi, useEnv } from '@/utilities'
import { get } from '@/utilities/get'

const kumaApi = useKumaApi()
const { t } = useI18n()
const env = useEnv()

const notifications = ref<{kind: string, payload: Record<string, string>}[]>([])

const change = (data: ZoneOverview) => {
  const warnings = []
  if (data.zoneInsight.store === 'memory') {
    warnings.push({
      kind: 'ZONE_STORE_TYPE_MEMORY',
      payload: {},
    })
  }
  const version = get(data.zoneInsight, 'version.kumaCp.version', '')
  if (!get(data.zoneInsight, 'version.kumaCp.kumaCpGlobalCompatible', 'true')) {
    warnings.push({
      kind: 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS',
      payload: {
        zoneCpVersion: version,
      },
    })
  } else if (compare(env('KUMA_VERSION'), version) === 1) {
    warnings.push({
      kind: 'OUTDATED_ZONE_VERSION',
      payload: {
        zoneCpVersion: version,
      },
    })
  }

  notifications.value = warnings
}
async function deleteZone(name: string) {
  // Intentionally not wrapped in a try-catch block so that the DeleteResourceModal can discover when the operation failed.
  await kumaApi.deleteZone({ name })
}

</script>
