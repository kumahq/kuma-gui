<template>
  <KCard>
    <template #body>
      <div class="entity-section-list">
        <section>
          <h1 class="entity-title">
            <span>
              Service:

              <TextWithCopyButton :text="props.service.name">
                <router-link :to="detailViewRoute">
                  {{ props.service.name }}
                </router-link>
              </TextWithCopyButton>
            </span>

            <StatusBadge
              v-if="status"
              :status="status"
            />
          </h1>

          <DefinitionList class="mt-4">
            <DefinitionListItem term="Address">
              <template v-if="address !== null">
                {{ address }}
              </template>

              <template v-else>
                —
              </template>
            </DefinitionListItem>

            <DefinitionListItem
              v-if="tls !== null"
              term="TLS"
            >
              {{ tls }}
            </DefinitionListItem>

            <DefinitionListItem
              v-if="numberOfDataPlaneProxies !== null"
              term="Data Plane Proxies"
            >
              {{ numberOfDataPlaneProxies }}
            </DefinitionListItem>

            <DefinitionListItem
              v-if="tags !== null"
              term="Tags"
            >
              <TagList :tags="tags" />
            </DefinitionListItem>
          </DefinitionList>
        </section>

        <ResourceCodeBlock
          id="code-block-service"
          :resource-fetcher="fetchService"
          :resource-fetcher-watch-key="props.service.name"
          is-searchable
          code-max-height="250px"
        />
      </div>
    </template>
  </KCard>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import { ExternalService, ServiceInsight } from '@/types/index.d'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()

const props = defineProps({
  service: {
    type: Object as PropType<ServiceInsight>,
    required: true,
  },

  externalService: {
    type: Object as PropType<ExternalService | null>,
    required: false,
    default: null,
  },
})

const detailViewRoute = computed(() => ({
  name: 'service-detail-view',
  params: {
    service: props.service.name,
    mesh: props.service.mesh,
  },
}))

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

const numberOfDataPlaneProxies = computed(() => {
  if (props.service.serviceType === 'external') {
    return null
  } else {
    const online = props.service.dataplanes?.online ?? 0
    const total = props.service.dataplanes?.total ?? 0

    return `${online} online / ${total} total`
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

<style lang="scss" scoped>
.entity-section-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--spacing-md);
}

.entity-section-list > * {
  flex-basis: 60ch;
  min-inline-size: 0;
}

.entity-section-list > :not(:last-child) {
  padding-right: var(--spacing-md);
}

.entity-title {
  display: flex;
  gap: var(--spacing-md);
}
</style>
