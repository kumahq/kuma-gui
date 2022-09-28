<template>
  <TabsWidget
    :tabs="tabs"
    initial-tab-override="overview"
  >
    <template #tabHeader>
      <div>
        <h3>
          Service: {{ processedServiceInsight.name }}
        </h3>
      </div>

      <div>
        <EntityURLControl
          :route="{
            name: 'service-insight-detail-view',
            params: {
              service: processedServiceInsight.name,
              mesh: processedServiceInsight.mesh,
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
              v-for="(value, prop) in processedServiceInsight"
              :key="prop"
            >
              <h4>{{ prop }}</h4>

              <template v-if="prop === 'status' && typeof value !== 'string'">
                <div
                  class="entity-status"
                  :class="{
                    'is-offline': value.name === 'offline',
                    'is-degraded': value.name === 'partially_degraded',
                  }"
                >
                  <span class="entity-status__label">{{ value.title }}</span>
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
        <YamlView :content="rawServiceInsight" />
      </div>
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'

import { ServiceInsight } from '@/types'
import { stripTimes } from '@/helpers'
import { STATUS } from '@/consts'
import EntityURLControl from '@/components/Utils/EntityURLControl.vue'
import LabelList from '@/components/Utils/LabelList.vue'
import TabsWidget from '@/components/Utils/TabsWidget.vue'
import YamlView from '@/components/Skeletons/YamlView.vue'

const props = defineProps({
  serviceInsight: {
    type: Object as PropType<ServiceInsight>,
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

const processedServiceInsight = computed(() => {
  const { name, mesh } = props.serviceInsight
  const status = {
    title: STATUS[props.serviceInsight.status].title,
    name: props.serviceInsight.status,
  }
  const { total, online } = props.serviceInsight.dataplanes
  const dataPlanes = `Total: ${total} (online: ${online})`

  return { name, mesh, status, dataPlanes }
})

const rawServiceInsight = computed(() => stripTimes(props.serviceInsight))
</script>

<style lang="scss" scoped>
.config-wrapper {
  padding: var(--spacing-md);
}
</style>
