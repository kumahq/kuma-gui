<template>
  <RouteView
    v-slot="{ can, route, t }"
    name="service-detail-view"
    :params="{
      mesh: '',
      service: '',
    }"
  >
    <AppView>
      <KCard>
        <div v-if="!can('use gateways ui') && props.data.serviceType === 'external'">
          <DataSource
            v-slot="{ data: externalService, error: externalServiceError }: ExternalServiceSource"
            :src="`/meshes/${route.params.mesh}/external-services/for/${route.params.service}`"
          >
            <ErrorBlock
              v-if="externalServiceError"
              :error="externalServiceError"
            />

            <LoadingBlock v-else-if="externalService === undefined" />

            <EmptyBlock
              v-else-if="externalService === null"
              data-testid="no-matching-external-service"
            >
              <template #title>
                <p>{{ t('services.detail.no_matching_external_service', { name: route.params.service }) }}</p>
              </template>
            </EmptyBlock>

            <div
              v-else
              class="columns"
            >
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <TextWithCopyButton :text="externalService.networking.address" />
                </template>
              </DefinitionCard>

              <DefinitionCard v-if="externalService.tags !== null">
                <template #title>
                  {{ t('http.api.property.tags') }}
                </template>

                <template #body>
                  <TagList :tags="externalService.tags" />
                </template>
              </DefinitionCard>
            </div>
          </DataSource>
        </div>

        <div
          v-else
          class="columns"
        >
          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.status') }}
            </template>

            <template #body>
              <StatusBadge :status="props.data.status" />
            </template>
          </DefinitionCard>

          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              <TextWithCopyButton
                v-if="props.data.addressPort"
                :text="props.data.addressPort"
              />

              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>

          <ResourceStatus
            :online="props.data.dataplanes?.online ?? 0"
            :total="props.data.dataplanes?.total ?? 0"
          >
            <template #title>
              {{ t('http.api.property.dataPlaneProxies') }}
            </template>
          </ResourceStatus>
        </div>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ServiceInsight } from '../data'
import type { ExternalServiceSource } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'

const props = defineProps<{
  data: ServiceInsight
}>()
</script>
