<template>
  <div class="stack">
    <KCard>
      <template #body>
        <div
          class="columns"
          style="--columns: 4;"
        >
          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.name') }}
            </template>

            <template #body>
              <TextWithCopyButton :text="props.serviceInsight.name">
                <RouterLink
                  :to="{
                    name: 'service-detail-view',
                    params: {
                      service: props.serviceInsight.name,
                      mesh: props.serviceInsight.mesh,
                    },
                  }"
                >
                  {{ props.serviceInsight.name }}
                </RouterLink>
              </TextWithCopyButton>
            </template>
          </DefinitionCard>

          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              {{ props.externalService.networking.address }}
            </template>
          </DefinitionCard>

          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.tls') }}
            </template>

            <template #body>
              {{ props.externalService.networking.tls?.enabled ? t('services.detail.enabled') : t('services.detail.disabled') }}
            </template>
          </DefinitionCard>

          <DefinitionCard v-if="props.externalService.tags !== null">
            <template #title>
              {{ t('http.api.property.tags') }}
            </template>

            <template #body>
              <TagList :tags="props.externalService.tags" />
            </template>
          </DefinitionCard>
        </div>
      </template>
    </KCard>

    <ResourceCodeBlock
      id="code-block-service"
      :resource="props.externalService"
      :resource-fetcher="fetchExternalService"
      is-searchable
      code-max-height="250px"
    />
  </div>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import { ExternalService, ServiceInsight } from '@/types/index.d'
import { useI18n, useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
const { t } = useI18n()

const props = defineProps<{
  serviceInsight: ServiceInsight
  externalService: ExternalService
}>()

async function fetchExternalService(params?: SingleResourceParameters) {
  const { mesh, name } = props.externalService
  return await kumaApi.getExternalService({ mesh, name }, params)
}
</script>
