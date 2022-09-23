<template>
  <TabsWidget
    :tabs="tabs"
    initial-tab-override="overview"
  >
    <template #tabHeader>
      <div>
        <h3>
          Service: {{ processedExternalService.name }}
        </h3>
      </div>

      <div>
        <EntityURLControl
          :route="{
            name: 'external-service-detail-view',
            params: {
              service: processedExternalService.name,
              mesh: processedExternalService.mesh,
            }
          }"
        />
      </div>
    </template>

    <template #overview>
      <LabelList>
        <div>
          <ul>
            <li
              v-for="(value, prop) in processedExternalService"
              :key="prop"
            >
              <h4>{{ prop }}</h4>

              <template v-if="prop === 'tags' && typeof value !== 'string'">
                <div class="entity-tag-list">
                  <EntityTag
                    v-for="(tag, index) in value"
                    :key="index"
                    :tag="tag"
                  />
                </div>
              </template>

              <template v-else>
                {{ value }}
              </template>
            </li>
          </ul>
        </div>
      </LabelList>
    </template>

    <template #yaml>
      <div class="config-wrapper">
        <YamlView :content="rawExternalService" />
      </div>
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'

import { ExternalService } from '@/types'
import { stripTimes } from '@/helpers'
import EntityTag from '@/components/EntityTag/EntityTag.vue'
import EntityURLControl from '@/components/Utils/EntityURLControl.vue'
import LabelList from '@/components/Utils/LabelList.vue'
import TabsWidget from '@/components/Utils/TabsWidget.vue'
import YamlView from '@/components/Skeletons/YamlView.vue'

const props = defineProps({
  externalService: {
    type: Object as PropType<ExternalService>,
    required: true,
  },
})

const tabs = [
  {
    hash: '#overview',
    title: 'Overview',
  },
  {
    hash: '#yaml',
    title: 'YAML',
  },
]

const processedExternalService = computed(() => {
  const { name, mesh } = props.externalService
  const tags = Object.entries(props.externalService.tags).map(([label, value]) => ({ label, value }))

  const address = props.externalService.networking.address
  const tls = props.externalService.networking.tls.enabled ? 'Enabled' : 'Disabled'

  return { name, mesh, tags, address, tls }
})

const rawExternalService = computed(() => stripTimes(props.externalService))
</script>

<style lang="scss" scoped>
.entity-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
}

.config-wrapper {
  padding: var(--spacing-md);
}
</style>
