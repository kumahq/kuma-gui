<template>
  <RouteView
    v-slot="{ route, t }"
    name="delegated-gateway-detail-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      dataplane: '',
    }"
  >
    <AppView>
      <DataSource
        v-slot="{ data, error }: ServiceInsightSource"
        :src="`/meshes/${route.params.mesh}/service-insights/${route.params.service}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <div
          v-else
          class="stack"
        >
          <KCard>
            <div
              class="columns"
            >
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <StatusBadge :status="data.status" />
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <TextWithCopyButton
                    v-if="data.addressPort"
                    :text="data.addressPort"
                  />

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>

              <ResourceStatus
                :online="data.dataplanes?.online ?? 0"
                :total="data.dataplanes?.total ?? 0"
              >
                <template #title>
                  {{ t('http.api.property.dataPlaneProxies') }}
                </template>
              </ResourceStatus>
            </div>
          </KCard>
        </div>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ServiceInsightSource } from '@/app/services/sources'
</script>
