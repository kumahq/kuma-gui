<template>
  <div class="stack">
    <KCard>
      <template #body>
        <div class="variable-columns">
          <DefinitionCard v-if="status !== null">
            <template #title>
              {{ t('http.api.property.status') }}
            </template>

            <template #body>
              <StatusBadge :status="status" />
            </template>
          </DefinitionCard>

          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.name') }}
            </template>

            <template #body>
              <TextWithCopyButton :text="props.service.name">
                <RouterLink
                  :to="{
                    name: 'service-detail-view',
                    params: {
                      service: props.service.name,
                      mesh: props.service.mesh,
                    },
                  }"
                >
                  {{ props.service.name }}
                </RouterLink>
              </TextWithCopyButton>
            </template>
          </DefinitionCard>

          <DefinitionCard v-if="address !== null">
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              {{ address }}
            </template>
          </DefinitionCard>

          <DefinitionCard v-if="tls !== null">
            <template #title>
              {{ t('http.api.property.tls') }}
            </template>

            <template #body>
              {{ tls }}
            </template>
          </DefinitionCard>

          <ResourceStatus
            v-if="dataPlaneProxies !== null"
            :online="dataPlaneProxies.online ?? 0"
            :total="dataPlaneProxies.total ?? 0"
          >
            <template #title>
              {{ t('http.api.property.dataPlaneProxies') }}
            </template>
          </ResourceStatus>

          <DefinitionCard v-if="tags !== null">
            <template #title>
              {{ t('http.api.property.tags') }}
            </template>

            <template #body>
              <TagList :tags="tags" />
            </template>
          </DefinitionCard>
        </div>
      </template>
    </KCard>

    <ResourceCodeBlock
      id="code-block-service"
      :resource="props.service"
      :resource-fetcher="fetchService"
      is-searchable
      :show-copy-as-kubernetes-button="props.service.serviceType === 'external' && props.externalService !== null"
      code-max-height="250px"
    />
  </div>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { computed } from 'vue'

import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import { ExternalService, ServiceInsight } from '@/types/index.d'
import { useI18n, useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
const { t } = useI18n()

const props = withDefaults(defineProps<{
  service: ServiceInsight
  externalService: ExternalService | null
}>(), {
  externalService: null,
})

const address = computed(() => {
  if (props.service.serviceType === 'external' && props.externalService !== null) {
    return props.externalService.networking.address
  } else {
    return props.service.addressPort ?? null
  }
})

const tls = computed(() => {
  if (props.service.serviceType === 'external' && props.externalService !== null) {
    return props.externalService.networking.tls?.enabled ? 'Enabled' : 'Disabled'
  } else {
    return null
  }
})

const dataPlaneProxies = computed(() => {
  if (props.service.serviceType === 'external') {
    return null
  } else {
    return props.service.dataplanes ?? null
  }
})

const status = computed(() => {
  if (props.service.serviceType === 'external') {
    return null
  } else {
    return props.service.status ?? null
  }
})

const tags = computed(() => {
  if (props.service.serviceType === 'external' && props.externalService !== null) {
    return props.externalService.tags
  } else {
    return null
  }
})

async function fetchService(params?: SingleResourceParameters) {
  if (props.service.serviceType === 'external' && props.externalService !== null) {
    const { mesh, name } = props.externalService
    return await kumaApi.getExternalService({ mesh, name }, params)
  } else {
    const { mesh, name } = props.service
    return await kumaApi.getServiceInsight({ mesh, name }, params)
  }
}
</script>
