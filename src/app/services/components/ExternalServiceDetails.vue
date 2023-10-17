<template>
  <div class="stack">
    <KCard>
      <template #body>
        <div class="columns">
          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              {{ props.externalService.networking.address }}
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
  </div>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import DefinitionCard from '@/app/common/DefinitionCard.vue'
import TagList from '@/app/common/TagList.vue'
import { ExternalService } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  externalService: ExternalService
}>()
</script>
