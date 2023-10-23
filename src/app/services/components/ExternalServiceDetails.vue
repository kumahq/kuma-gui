<template>
  <div>
    <DataSource
      v-slot="{ data: externalService, error }: ExternalServiceSource"
      :src="`/meshes/${props.mesh}/external-services/for/${props.service}`"
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
          <p>{{ t('services.detail.no_matching_external_service', { name: props.service }) }}</p>
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
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  mesh: string
  service: string
}>()
</script>
