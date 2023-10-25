<template>
  <div>
    <DataSource
      v-slot="{ data: externalService, error: externalServiceError }: ExternalServiceSource"
      :src="`/meshes/${props.mesh}/external-services/for/${props.service}`"
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
          <p>{{ t('services.detail.no_matching_external_service', { name: props.service }) }}</p>
        </template>
      </EmptyBlock>

      <ResourceCodeBlock
        v-else
        id="code-block-service"
        :resource="externalService"
        :resource-fetcher="(params) => kumaApi.getExternalService({ mesh: externalService.mesh, name: externalService.name }, params)"
        is-searchable
      />
    </DataSource>
  </div>
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import { useI18n, useKumaApi } from '@/utilities'

const { t } = useI18n()
const kumaApi = useKumaApi()

const props = defineProps<{
  mesh: string
  service: string
}>()
</script>
