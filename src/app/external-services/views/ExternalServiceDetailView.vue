<template>
  <RouteView
    v-slot="{ route, t }"
    name="external-service-detail-view"
    :params="{
      mesh: '',
      service: '',
    }"
  >
    <AppView>
      <DataSource
        v-slot="{ data, error }: ExternalServiceSource"
        :src="`/meshes/${route.params.mesh}/external-services/${route.params.service}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <KCard
          v-else
          data-testid="external-service-details"
        >
          <div class="columns">
            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.address') }}
              </template>

              <template #body>
                <TextWithCopyButton :text="data.networking.address" />
              </template>
            </DefinitionCard>

            <DefinitionCard v-if="data.tags">
              <template #title>
                {{ t('http.api.property.tags') }}
              </template>

              <template #body>
                <TagList :tags="data.tags" />
              </template>
            </DefinitionCard>
          </div>
        </KCard>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
