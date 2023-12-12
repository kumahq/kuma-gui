<template>
  <RouteView
    v-slot="{ route }"
    name="service-summary-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView>
      <template #title>
        <div class="summary-title-wrapper">
          <img
            aria-hidden="true"
            src="@/assets/images/icon-wifi-tethering.svg?url"
          >

          <h2 class="summary-title">
            <RouterLink
              :to="{
                name: 'service-detail-view',
                params: {
                  service: route.params.service,
                },
              }"
            >
              <RouteTitle
                :title="t('services.routes.item.title', { name: route.params.service })"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <EmptyBlock v-if="props.service === undefined">
        {{ t('common.collection.summary.empty_title', { type: 'Service' }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: 'Service' }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('services.routes.item.overview') }}</h3>

          <div class="mt-4">
            <div v-if="props.service.serviceType === 'external'">
              <DataSource
                v-slot="{ data: externalService, error }: ExternalServiceSource"
                :src="`/meshes/${props.service.mesh}/external-services/for/${props.service.name}`"
              >
                <ErrorBlock
                  v-if="error"
                  :error="error"
                />

                <LoadingBlock v-else-if="externalService === undefined" />

                <EmptyBlock
                  v-else-if="externalService === null"
                  data-testid="no-matching-external-service"
                >
                  <template #title>
                    <p>{{ t('services.detail.no_matching_external_service', { name: props.service.name }) }}</p>
                  </template>
                </EmptyBlock>

                <div
                  v-else
                  class="stack"
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
              class="stack"
            >
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <StatusBadge :status="props.service.status" />
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <TextWithCopyButton
                    v-if="props.service.addressPort"
                    :text="props.service.addressPort"
                  />

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>

              <ResourceStatus
                :online="props.service.dataplanes?.online ?? 0"
                :total="props.service.dataplanes?.total ?? 0"
              >
                <template #title>
                  {{ t('http.api.property.dataPlaneProxies') }}
                </template>
              </ResourceStatus>
            </div>
          </div>
        </div>

        <div v-if="props.service.serviceType === 'external'">
          <h3>{{ t('services.routes.item.config') }}</h3>

          <div class="mt-4">
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

              <ResourceCodeBlock
                v-else
                id="code-block-service"
                :resource="externalService"
                :resource-fetcher="(params) => kumaApi.getExternalService({ mesh: externalService.mesh, name: externalService.name }, params)"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter === 'true'"
                :is-reg-exp-mode="route.params.codeRegExp === 'true'"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </DataSource>
          </div>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ServiceInsight } from '@/app/services/data'
import { useI18n, useKumaApi } from '@/utilities'

const { t } = useI18n()
const kumaApi = useKumaApi()

const props = withDefaults(defineProps<{
  service?: ServiceInsight
}>(), {
  service: undefined,
})
</script>

<style lang="scss" scoped>
.summary-title-wrapper {
  display: flex;
  align-items: baseline;
  gap: $kui-space-30;
  // Accounts for the absolutely-positioned close button
  margin-right: calc($kui-space-30 + 24px);
}

.summary-title {
  margin-top: 0;
}
</style>
